import ExpoModulesCore
import Tixngo
import UIKit

class SdkView: ExpoView {
  let onLoad = EventDispatcher()
  let onError = EventDispatcher()

  private var hostedController: UIViewController?
  private var isLoading = false

  var widget: SDKWidget = .home {
    didSet {
      guard oldValue != widget, window != nil else { return }
      unmount()
      mount()
    }
  }

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()
    if window != nil {
      mount()
    } else {
      unmount()
    }
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    hostedController?.view.frame = bounds
  }

  private func mount() {
    if hostedController != nil || isLoading { return }
    guard let parent = parentViewController() else {
      onError(["code": -1, "message": "No hay un UIViewController padre"])
      return
    }
    let requested = widget
    isLoading = true
    tixngo.getSDKScreen(type: requested, presentType: .embed) { [weak self] error, viewController in
      DispatchQueue.main.async {
        guard let self else { return }
        self.isLoading = false
        guard error == nil, let viewController else {
          self.onError(errorMap(error))
          return
        }
        if self.window == nil { return }
        if requested != self.widget {
          self.mount()
          return
        }
        // El SDK devuelve siempre el mismo controlador; si sigue presentado o embebido en otro sitio, lo soltamos.
        viewController.willMove(toParent: nil)
        viewController.view.removeFromSuperview()
        viewController.removeFromParent()

        parent.addChild(viewController)
        viewController.view.frame = self.bounds
        viewController.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        self.addSubview(viewController.view)
        viewController.didMove(toParent: parent)
        self.hostedController = viewController
        self.onLoad(["widget": widgetName(requested)])
      }
    }
  }

  // Primer UIViewController en la cadena de responders (el de la pantalla de React que contiene la vista).
  private func parentViewController() -> UIViewController? {
    var responder: UIResponder? = next
    while let current = responder {
      if let viewController = current as? UIViewController {
        return viewController
      }
      responder = current.next
    }
    return nil
  }

  func unmount() {
    guard let current = hostedController else { return }
    hostedController = nil
    current.willMove(toParent: nil)
    current.view.removeFromSuperview()
    current.removeFromParent()
    tixngo.dispose()
  }
}
