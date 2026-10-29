package expo.modules.sdk

import CustomAppId
import SDKPresentType
import SDKTokenType
import SDKWidget
import SSPScope
import TixngoConfiguration
import TixngoEnv
import TixngoLanguage
import TixngoSDKConfig
import android.os.Handler
import android.os.Looper
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import io.tixngo.sdkutils.TixngoManager
import io.tixngo.sdkutils.TixngoSDKDelegate
import io.tixngo.sdkutils.TixngoSDKError

class AppIdsOptions : Record {
  @Field val demo: String = ""
  @Field val int: String = ""
  @Field val `val`: String = ""
  @Field val preProd: String = ""
  @Field val prod: String = ""
}

class InitializeOptions : Record {
  @Field val env: String = "PREPROD"
  @Field val appIds: AppIdsOptions = AppIdsOptions()
  @Field val language: String = "ES_ES"
  @Field val supportLanguages: List<String> = emptyList()
  @Field val debug: Boolean = false
  @Field val renewalTokenTimeoutMs: Int = 30_000
  @Field val initializeTimeoutMs: Int = 20_000
}

internal val tixngo: TixngoManager
  get() = TixngoManager.instance

internal fun widgetOf(name: String?): SDKWidget = when (name) {
  "transferCenter" -> SDKWidget.TransferCenter
  "deletedTicket" -> SDKWidget.DeletedTicket
  "resale" -> SDKWidget.Resale
  "support" -> SDKWidget.Support
  else -> SDKWidget.Home
}

private fun Map<String, Any?>.stringValues(): Map<String, String> =
  entries.mapNotNull { (key, value) -> value?.let { key to it.toString() } }.toMap()

internal fun TixngoSDKError?.toMap(): Map<String, Any> = buildMap {
  put("code", this@toMap?.code ?: -1)
  put("message", this@toMap?.message ?: "TIXNGO SDK error")
  // TIXNGO pone el nombre del error (NO_TICKET_ELIGIBILITY, ...) en userInfo["error"].
  this@toMap?.userInfo?.let { put("userInfo", it.stringValues()) }
}

private fun Promise.reject(error: TixngoSDKError?) =
  reject("ERR_TIXNGO_${error?.code ?: "UNKNOWN"}", error?.message ?: "TIXNGO SDK error", null)

class SdkModule : Module() {
  private val mainHandler = Handler(Looper.getMainLooper())
  private var pendingInitialize: Promise? = null
  private var pendingTokenRenewal: ((Boolean) -> Unit)? = null

  private val delegate = object : TixngoSDKDelegate {
    override fun onInitialized(isAuthenticated: Boolean) {
      pendingInitialize?.resolve(isAuthenticated)
      pendingInitialize = null
      sendEvent("onInitialized", mapOf("isAuthenticated" to isAuthenticated))
    }

    override fun didChangedAuthenticatedStatus(isAuthenticated: Boolean) {
      sendEvent("onAuthStatusChanged", mapOf("isAuthenticated" to isAuthenticated))
    }

    // El SDK retiene las peticiones hasta que la app entregue un token nuevo con updateToken().
    override fun onJWTTokenExpired(completion: (Boolean) -> Unit) {
      pendingTokenRenewal = completion
      sendEvent("onTokenExpired")
    }

    override fun onSDKDeviceRefused() {
      sendEvent("onDeviceRefused")
    }

    override fun onSDKError(error: TixngoSDKError?) {
      pendingInitialize?.reject(error)
      pendingInitialize = null
      sendEvent("onError", error.toMap())
    }

    override fun onClosedSDK() {
      sendEvent("onClosed")
    }

    override fun didChangedFrozenMode(isFrozen: Boolean) {
      sendEvent("onFrozenModeChanged", mapOf("isFrozen" to isFrozen))
    }

    override fun onTrackEvents(eventName: String, data: Map<String, Any?>?) {
      sendEvent("onTrackEvent", mapOf("name" to eventName, "data" to data?.stringValues()))
    }
  }

  override fun definition() = ModuleDefinition {
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
    AsyncFunction("initialize") { options: InitializeOptions, promise: Promise ->
      if (tixngo.isInitialized) {
        promise.resolve(tixngo.isAuthenticated)
        return@AsyncFunction
      }
      if (pendingInitialize != null) {
        promise.reject("ERR_TIXNGO_INIT_IN_PROGRESS", "El SDK de TIXNGO ya se está inicializando", null)
        return@AsyncFunction
      }
      val env = TixngoEnv.valueOf(options.env)
      val appId = when (env) {
        TixngoEnv.DEMO -> options.appIds.demo
        TixngoEnv.INT -> options.appIds.int
        TixngoEnv.VAL -> options.appIds.`val`
        TixngoEnv.PREPROD -> options.appIds.preProd
        TixngoEnv.PROD -> options.appIds.prod
      }
      // Sin app ID el backend responde 500 y el SDK falla sin llamar a ningún callback.
      if (appId.isBlank()) {
        promise.reject("ERR_TIXNGO_MISSING_APP_ID", "Falta el app ID de TIXNGO para el entorno ${env.name}", null)
        return@AsyncFunction
      }
      val context = appContext.reactContext?.applicationContext ?: throw Exceptions.ReactContextLost()
      val language = TixngoLanguage.valueOf(options.language)
      val config = TixngoConfiguration(
        isEnableScreenshotSSK = true,
        sspScope = SSPScope.SDK,
        isEnableDebug = options.debug,
        defaultEnv = env,
        isEnableWallet = false,
        defaultLanguage = language,
        supportLanguages = options.supportLanguages.map(TixngoLanguage::valueOf).ifEmpty { listOf(language) }.toTypedArray(),
        appIds = CustomAppId(
          demoId = options.appIds.demo,
          intId = options.appIds.int,
          valId = options.appIds.`val`,
          preProdId = options.appIds.preProd,
          prodId = options.appIds.prod
        ),
        // El login y el logout los controla la app host.
        config = TixngoSDKConfig(isHaveSignOut = false, isHaveMenu = false),
        tokenType = SDKTokenType.IdToken
      )
      pendingInitialize = promise
      // Si la inicialización falla (p. ej. GetConfig 500), el SDK no llama a onInitialized ni a onSDKError.
      mainHandler.postDelayed({
        if (pendingInitialize === promise) {
          pendingInitialize = null
          promise.reject(
            "ERR_TIXNGO_INIT_TIMEOUT",
            "El SDK de TIXNGO no terminó de inicializar en ${options.initializeTimeoutMs} ms. Revisa logcat (isEnableDebug).",
            null
          )
        }
      }, options.initializeTimeoutMs.toLong())
      val appIconId = context.applicationInfo.icon.takeIf { it != 0 }
      tixngo.initialize(context, appIconId, options.renewalTokenTimeoutMs.toLong(), config, delegate)
    }.runOnQueue(Queues.MAIN)

    // Entrega el id_token del IDP. Si el SDK estaba esperando una renovación, la libera.
    AsyncFunction("updateToken") { token: String, promise: Promise ->
      tixngo.updateToken(token) { error ->
        if (error != null) {
          promise.reject(error)
        } else {
          pendingTokenRenewal?.invoke(true)
          pendingTokenRenewal = null
          promise.resolve(null)
        }
      }
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("signOut") { promise: Promise ->
      tixngo.signOut { error -> if (error != null) promise.reject(error) else promise.resolve(null) }
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("getAuthStatus") { promise: Promise ->
      tixngo.getAuthStatus { isAuthenticated -> promise.resolve(isAuthenticated) }
    }.runOnQueue(Queues.MAIN)

    // Abre el SDK a pantalla completa (modo Present), fuera de la jerarquía de React.
    AsyncFunction("open") { widget: String?, promise: Promise ->
      val activity = appContext.currentActivity ?: throw Exceptions.MissingActivity()
      tixngo.openSDKWidget(activity, widgetOf(widget), SDKPresentType.Present) { error ->
        if (error != null) promise.reject(error) else promise.resolve(null)
      }
    }.runOnQueue(Queues.MAIN)

    View(SdkView::class) {
      Events("onLoad", "onError")

      Prop("widget") { view: SdkView, widget: String? ->
        view.widget = widgetOf(widget)
      }

      OnViewDestroys { view: SdkView ->
        view.unmount()
      }
    }
  }
}
