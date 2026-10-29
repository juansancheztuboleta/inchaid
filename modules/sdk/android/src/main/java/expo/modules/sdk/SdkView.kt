package expo.modules.sdk

import SDKPresentType
import SDKWidget
import android.content.Context
import android.view.View
import android.widget.FrameLayout
import androidx.fragment.app.FragmentActivity
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView
import io.flutter.embedding.android.FlutterFragment

class SdkView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  override val shouldUseAndroidLayout = true

  private val onLoad by EventDispatcher()
  private val onError by EventDispatcher()

  private val container = FrameLayout(context).apply {
    id = View.generateViewId()
    layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
  }

  private var fragment: FlutterFragment? = null
  private var isLoading = false

  var widget: SDKWidget = SDKWidget.Home
    set(value) {
      if (field == value) return
      field = value
      if (isAttachedToWindow) {
        unmount()
        mount()
      }
    }

  init {
    addView(container)
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    mount()
  }

  override fun onDetachedFromWindow() {
    unmount()
    super.onDetachedFromWindow()
  }

  private fun mount() {
    if (fragment != null || isLoading) return
    val activity = appContext.currentActivity as? FragmentActivity
    if (activity == null) {
      onError(mapOf("code" to -1, "message" to "No hay una FragmentActivity activa"))
      return
    }
    val requested = widget
    isLoading = true
    tixngo.getSDKWidgetFragment(requested, SDKPresentType.Embed) { error, flutterFragment ->
      post {
        isLoading = false
        if (error != null || flutterFragment == null) {
          onError(error.toMap())
          return@post
        }
        if (!isAttachedToWindow || activity.isFinishing) return@post
        if (requested != widget) {
          mount()
          return@post
        }
        fragment = flutterFragment
        activity.supportFragmentManager
          .beginTransaction()
          .replace(container.id, flutterFragment)
          .commitAllowingStateLoss()
        onLoad(mapOf("widget" to requested.name))
      }
    }
  }

  fun unmount() {
    val current = fragment ?: return
    fragment = null
    val fragmentManager = (appContext.currentActivity as? FragmentActivity)?.supportFragmentManager
    if (fragmentManager != null && !fragmentManager.isDestroyed && current.isAdded) {
      fragmentManager.beginTransaction().remove(current).commitAllowingStateLoss()
    }
    
    tixngo.dispose()
  }
}
