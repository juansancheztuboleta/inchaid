const { withProjectBuildGradle } = require('expo/config-plugins');

const MARKER = '// with-short-cxx-dir';

/**
 * En Windows, ninja falla con rutas de más de 260 caracteres. CMake guarda sus objetos en
 * `<módulo>/android/.cxx/...`, dentro de node_modules. Este plugin lleva el directorio de
 * compilación nativa de cada módulo a una raíz corta (por defecto C:/b), sin mover el proyecto.
 */
const BLOCK = `
${MARKER}
if (System.getProperty('os.name').toLowerCase().contains('windows')) {
  subprojects { sp ->
    sp.afterEvaluate {
      def android = sp.extensions.findByName('android')
      if (android != null && android.externalNativeBuild.cmake.path != null) {
        android.externalNativeBuild.cmake.buildStagingDirectory = new File("C:/b/\${sp.name}")
      }
    }
  }
}
`;

module.exports = function withShortCxxDir(config) {
  return withProjectBuildGradle(config, (cfg) => {
    if (cfg.modResults.language === 'groovy' && !cfg.modResults.contents.includes(MARKER)) {
      // Antes de los `apply plugin`: después, Gradle ya evaluó los subproyectos.
      cfg.modResults.contents = cfg.modResults.contents.replace(
        'apply plugin: "expo-root-project"',
        `${BLOCK}
apply plugin: "expo-root-project"`
      );
    }
    return cfg;
  });
};
