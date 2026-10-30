import ExpoModulesCore
import Tixngo
#if canImport(native_font)
import native_font
#endif

struct AppIdsOptions: Record {
  @Field var demo: String = ""
  @Field var int: String = ""
  @Field var val: String = ""
  @Field var preProd: String = ""
  @Field var prod: String = ""
}

// Dominio de la API por entorno (slot). La demo usa p. ej. https://val5-api.tixngo.io para VAL.
struct CustomDomainsOptions: Record {
  @Field var demo: String?
  @Field var int: String?
  @Field var val: String?
  @Field var preProd: String?
  @Field var prod: String?
}

struct InitializeOptions: Record {
  @Field var env: String = "PREPROD"
  @Field var appIds: AppIdsOptions = AppIdsOptions()
  @Field var customDomains: CustomDomainsOptions?
  @Field var deeplinkPathPrefix: String?
  @Field var deeplinkHost: String?
  @Field var language: String = "ES_ES"
  @Field var supportLanguages: [String] = []
  @Field var debug: Bool = false
  @Field var renewalTokenTimeoutMs: Int = 30_000
  @Field var initializeTimeoutMs: Int = 20_000
}

internal var tixngo: TixngoManager {
  TixngoManager.shared
}

internal func widgetOf(_ name: String?) -> SDKWidget {
  switch name {
  case "transferCenter": return .transferCenter
  case "deletedTicket": return .deletedTicket
  case "resale": return .resale
  case "support": return .support
  default: return .home
  }
}

internal func widgetName(_ widget: SDKWidget) -> String {
  switch widget {
  case .home: return "Home"
  case .transferCenter: return "TransferCenter"
  case .deletedTicket: return "DeletedTicket"
  case .resale: return "Resale"
  case .support: return "Support"
  }
}

// En JS se usan los nombres del enum de Android (ES_ES); en iOS el rawValue es el código (es-ES).
private func languageOf(_ name: String) -> TixngoLanguage? {
  switch name {
  case "EN": return .en
  case "EN_US": return .en_us
  case "ES_ES": return .es_es
  case "ES_MX": return .es_mx
  case "FR": return .fr
  case "FR_CA": return .fr_ca
  case "PT_PT": return .pt_PT
  case "AR": return .ar
  case "DE": return .de
  case "NL": return .nl
  default: return nil
  }
}

// La demo registra este manejador en el AppDelegate. Sin él el plugin de fuentes de Flutter no tiene a quién
// pedir "Inter"; respondemos nil para que use la fuente del sistema.
private func registerFontHandler() {
  #if canImport(native_font)
  NativeFontPlugin.fontDataHandler = { _, _, _, callback in
    callback(nil)
  }
  #endif
}

private func stringValues(_ dict: [String: Any]?) -> [String: String]? {
  dict?.compactMapValues { value in
    value is NSNull ? nil : String(describing: value)
  }
}

internal func errorMap(_ error: TixngoSDKError?) -> [String: Any] {
  var map: [String: Any] = [
    "code": error?.code ?? -1,
    "message": error?.message ?? "TIXNGO SDK error"
  ]
  // TIXNGO pone el nombre del error (NO_TICKET_ELIGIBILITY, ...) en userInfor["error"].
  if let userInfo = stringValues(error?.userInfor) {
    map["userInfo"] = userInfo
  }
  return map
}

private extension Promise {
  func reject(_ error: TixngoSDKError?) {
    reject("ERR_TIXNGO_\(error.map { String($0.code) } ?? "UNKNOWN")", error?.message ?? "TIXNGO SDK error")
  }
}

public class SdkModule: Module, TixngoSDKDelegate {
  private var pendingInitialize: Promise?
  private var initializeAttempt = 0
  private var pendingTokenRenewal: ExpiredTokenCompletionHandler?

  public func definition() -> ModuleDefinition {
    Name("Sdk")

    Events(
      "onInitialized",
      "onAuthStatusChanged",
      "onTokenExpired",
      "onDeviceRefused",
      "onError",
      "onClosed",
      "onFrozenModeChanged",
      "onTrackEvent"
    )

    // Resuelve con isAuthenticated cuando el SDK llama a onInitialized.
    AsyncFunction("initialize") { (options: InitializeOptions, promise: Promise) in
      if tixngo.isInitialized {
        promise.resolve(tixngo.isAuthenticated)
        return
      }
      if self.pendingInitialize != nil {
        promise.reject("ERR_TIXNGO_INIT_IN_PROGRESS", "El SDK de TIXNGO ya se está inicializando")
        return
      }
      guard let env = TixngoEnv(rawValue: options.env) else {
        promise.reject("ERR_TIXNGO_INVALID_ENV", "Entorno de TIXNGO no válido: \(options.env)")
        return
      }
      let appIds = options.appIds
      let appId: String
      switch env {
      case .demo: appId = appIds.demo
      case .int: appId = appIds.int
      case .val: appId = appIds.val
      case .preprod: appId = appIds.preProd
      case .prod: appId = appIds.prod
      }
      // Sin app ID el backend responde 500 y el SDK falla sin llamar a ningún callback.
      if appId.trimmingCharacters(in: .whitespaces).isEmpty {
        promise.reject("ERR_TIXNGO_MISSING_APP_ID", "Falta el app ID de TIXNGO para el entorno \(env.rawValue)")
        return
      }
      let language = languageOf(options.language) ?? .es_es
      let supportLanguages = options.supportLanguages.compactMap(languageOf)
      let config = TixngoConfiguration(
        isEnableScreenshotSSK: true,
        sskScope: .sdk,
        isEnableDebug: options.debug,
        defaultEnv: env,
        isEnableWallet: false,
        supportLanguages: supportLanguages.isEmpty ? [language] : supportLanguages,
        defaultLanguage: language,
        theme: SDKTheme(font: "Inter"),
        appIds: CustomAppId(
          demo: appIds.demo,
          int: appIds.int,
          val: appIds.val,
          preProd: appIds.preProd,
          prod: appIds.prod
        ),
        // El login y el logout los controla la app host.
        config: TixngoSDKConfig(isExistSignout: false, isHaveMenu: false),
        customDomain: options.customDomains.map {
          TixngoCustomDomain(
            demoDomain: $0.demo,
            intDomain: $0.int,
            valDomain: $0.val,
            preProdDomain: $0.preProd,
            prodDomain: $0.prod
          )
        },
        tokenType: .idToken,
        deeplinkPathPrefix: options.deeplinkPathPrefix,
        deeplinkHost: options.deeplinkHost
      )
      registerFontHandler()
      self.pendingInitialize = promise
      self.initializeAttempt += 1
      let attempt = self.initializeAttempt
      // Si la inicialización falla (p. ej. GetConfig 500), el SDK no llama a onInitialized ni a onSDKError.
      DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(options.initializeTimeoutMs)) {
        guard attempt == self.initializeAttempt, let pending = self.pendingInitialize else { return }
        self.pendingInitialize = nil
        pending.reject(
          "ERR_TIXNGO_INIT_TIMEOUT",
          "El SDK de TIXNGO no terminó de inicializar en \(options.initializeTimeoutMs) ms. Revisa la consola de Xcode (debug)."
        )
      }
      tixngo.initialize(
        config: config,
        renewalTokenTimeout: Double(options.renewalTokenTimeoutMs) / 1000,
        delegate: self
      )
    }.runOnQueue(.main)

    // Entrega el id_token del IDP. Si el SDK estaba esperando una renovación, la libera.
    AsyncFunction("updateToken") { (token: String, promise: Promise) in
      tixngo.updateToken(token: token) { error in
        if let error {
          promise.reject(error)
        } else {
          self.pendingTokenRenewal?(true)
          self.pendingTokenRenewal = nil
          promise.resolve(nil)
        }
      }
    }.runOnQueue(.main)

    AsyncFunction("signOut") { (promise: Promise) in
      tixngo.signOut { error in
        if let error { promise.reject(error) } else { promise.resolve(nil) }
      }
    }.runOnQueue(.main)

    AsyncFunction("getAuthStatus") { (promise: Promise) in
      tixngo.getAuthStatus { isAuthenticated in
        promise.resolve(isAuthenticated)
      }
    }.runOnQueue(.main)

    // Abre el SDK a pantalla completa (modo Present), fuera de la jerarquía de React.
    AsyncFunction("open") { (widget: String?, promise: Promise) in
      tixngo.getSDKScreen(type: widgetOf(widget), presentType: .present) { error, viewController in
        DispatchQueue.main.async {
          guard error == nil, let viewController else {
            promise.reject(error)
            return
          }
          guard let presenter = TixngoAppContext.topViewController() else {
            promise.reject("ERR_TIXNGO_NO_VIEW_CONTROLLER", "No hay un UIViewController activo")
            return
          }
          viewController.modalPresentationStyle = .fullScreen
          presenter.present(viewController, animated: true) {
            promise.resolve(nil)
          }
        }
      }
    }.runOnQueue(.main)

    View(SdkView.self) {
      Events("onLoad", "onError")

      Prop("widget") { (view: SdkView, widget: String?) in
        view.widget = widgetOf(widget)
      }
    }
  }

  // MARK: - TixngoSDKDelegate

  public func onInitialized(isAuthenticated: Bool) {
    pendingInitialize?.resolve(isAuthenticated)
    pendingInitialize = nil
    sendEvent("onInitialized", ["isAuthenticated": isAuthenticated])
  }

  public func didChangedAuthenticatedStatus(isAuthenticated: Bool) {
    sendEvent("onAuthStatusChanged", ["isAuthenticated": isAuthenticated])
  }

  // El SDK retiene las peticiones hasta que la app entregue un token nuevo con updateToken().
  public func onJWTTokenExpired(completion: @escaping ExpiredTokenCompletionHandler) {
    pendingTokenRenewal = completion
    sendEvent("onTokenExpired")
  }

  public func onSDKDeviceRefused() {
    sendEvent("onDeviceRefused")
  }

  public func onSDKError(error: TixngoSDKError?) {
    pendingInitialize?.reject(error)
    pendingInitialize = nil
    sendEvent("onError", errorMap(error))
  }

  public func onClosedSDK() {
    sendEvent("onClosed")
  }

  public func didChangedFrozenMode(isFrozen: Bool) {
    sendEvent("onFrozenModeChanged", ["isFrozen": isFrozen])
  }

  public func onTrackEvents(eventName: String, data: [String: Any]?) {
    var payload: [String: Any] = ["name": eventName]
    if let data = stringValues(data) {
      payload["data"] = data
    }
    sendEvent("onTrackEvent", payload)
  }
}
