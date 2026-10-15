import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";


type RootStackParamList = {
  ProfileScreen: undefined;
  ProductsScreen: undefined;
  LoginScreen: undefined;
  RewardsScreen: undefined;
  SettingsScreen: undefined;
  TermsScreen: undefined;
};

type TermsScreenProps = NativeStackScreenProps<RootStackParamList, "TermsScreen">;

export function TermsScreen({ navigation }: TermsScreenProps) {
  const { theme, colors } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.screen }]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      <View style={[styles.phoneShell, { backgroundColor: colors.shell, borderColor: colors.border }]}>
        <View style={styles.topBar}>
          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={[styles.tabText, { color: colors.text }]}>Cerrar Sesion</Text>
          </Pressable>

          <Pressable style={styles.logoutButton}>
            <Text style={styles.logoutIcon}>?</Text>
          </Pressable>
        </View>


        <Text style={[styles.brand, { color: colors.text }]}>TERMINOS Y CONDICIONES</Text>

        <Text style={[styles.closeText, { color: colors.mutedText }]}>Última actualización: 29 de septiembre de 2026

Le damos la bienvenida a la aplicación móvil y plataforma digital de Bar Malva (en adelante, la "Aplicación"). Al registrar una cuenta, acceder, navegar o utilizar cualquier funcionalidad o servicio prestado a través de nuestra Aplicación (según lo descrito en la Sección 1), usted acepta quedar legalmente vinculado por los siguientes términos y condiciones (los "Términos del Servicio").

Lea detenidamente este documento antes de continuar con el uso de la Aplicación. Si no está de acuerdo con la totalidad de estos Términos del Servicio, deberá abstenerse de instalar, acceder o utilizar la Aplicación.

1. Definiciones y Partes Contratantes
Tal como se utiliza en estos Términos del Servicio:

"Nosotros", "nos", "nuestro" y "Malva" hacen referencia a la sociedad comercial, administración y razón social operadora de Bar Malva, así como a sus filiales, subsidiarias y representantes autorizados.

"Usted", "Usuario" o "Cliente" se refiere a cualquier persona física que acceda, se registre o consuma a través de la Aplicación (debiendo ser mayor de edad según la legislación aplicable para el consumo de alcohol), o a la entidad jurídica en cuyo nombre se utilice la Aplicación para eventos, reservas corporativas o servicios institucionales.

"Servicios" abarca colectivamente todas las herramientas digitales, funcionalidades, compras, reservas y servicios presenciales gestionados mediante la Aplicación.

2. Alcance de los Servicios de la Aplicación
Malva proporciona una plataforma digital integral orientada a mejorar la experiencia gastronómica y de entretenimiento de sus clientes. Entre otras características, la Aplicación incluye:

Reservas y Gestión de Mesas: Consulta de disponibilidad en tiempo real, reserva de mesas, espacios VIP o zonas especiales.

Menú Digital y Pedidos: Visualización de la carta de bebidas, cócteles, platillos y promociones, así como la opción de realizar pedidos desde la mesa o de forma anticipada.

Pagos y Facturación Electrónica: Procesamiento seguro de pagos con tarjeta de crédito, débito y billeteras digitales, división de cuentas y emisión de comprobantes.

Programas de Fidelización y Recompensas: Accumulación de puntos, canje de beneficios, promociones exclusivas y descuentos personalizados.

Eventos y Experiencias: Adquisición de entradas, acceso a listas de invitados y reservas para eventos especiales o presentaciones en vivo.

Cualquier nueva función, herramienta, actualización o mejora que se agregue a la Aplicación estará igualmente sujeta a estos Términos del Servicio. Puede revisar la versión actualizada de estos términos en cualquier momento dentro del menú de configuración de la Aplicación o en nuestro sitio web oficial.

3. Registro de Cuenta y Requisitos de Edad
Para acceder a la mayoría de las funciones de la Aplicación, se requiere la creación de una cuenta de usuario. Al registrarse, usted garantiza que:

Mayoría de edad: Tiene la edad legal mínima requerida en su jurisdicción para el consumo e ingesta de bebidas alcohólicas (generalmente 18 años). Nos reservamos el derecho de solicitar identificación física en el establecimiento.

Veracidad de la información: Proporcionará información exacta, completa y actualizada durante el proceso de registro y mantendrá dicha información al día.

Seguridad de la cuenta: Es el único responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades que ocurran bajo su cuenta. Debe notificar a Malva de inmediato ante cualquier uso no autorizado.

4. Políticas de Convivencia, Reserva y Cancelaciones
El uso de la Aplicación para realizar reservas u órdenes implica la aceptación estricta de las normas operativas del Bar Malva:

Tolerancia de Reserva: Las reservas realizadas por la Aplicación cuentan con un margen de tolerancia (por ejemplo, 15 minutos). Transcurrido este tiempo, la mesa podrá ser liberada sin responsabilidad para el establecimiento.

Política de Cancelación: Las cancelaciones deben realizarse con el tiempo de antelación estipulado en la Aplicación. Ciertas reservas VIP o de fechas especiales pueden estar sujetas a penalizaciones o depósitos no reembolsables.

Derecho de Admisión y Permanencia: La confirmación de una reserva a través de la Aplicación no exime al usuario del cumplimiento del código de vestimenta, conducta y estado de sobriedad requeridos para el ingreso al establecimiento. Malva se reserva el derecho de admisión y permanencia conforme a la ley.

5. Pagos, Precios y Reembolsos
Precios: Todos los precios exhibidos en la Aplicación incluyen los impuestos aplicables, salvo que se indique lo contrario. Nos reservamos el derecho de modificar los precios y la disponibilidad del menú sin previo aviso.

Procesamiento de Pagos: Las transacciones se procesan a través de pasarelas de pago de terceros seguras. Malva no almacena datos completos de tarjetas bancarias.

Propinas: Cualquier porcentaje de propina sugerido en la Aplicación es de carácter voluntario, conforme a las normativas locales sobre el servicio.

6. Documentos Complementarios y Privacidad
Antes de hacer uso de la Aplicación, debe leer y aceptar expresamente nuestros documentos legales complementarios:

Política de Privacidad y Tratamiento de Datos Personales: Que explica cómo recopilamos, usamos y protegemos su información personal y geolocalización.

Política de Consumo Responsable: Que promueve el disfrute seguro y moderado de nuestras bebidas.

Términos de Programas de Lealtad: Las reglas específicas aplicables a los puntos, niveles de usuario y beneficios acumulados.

7. Modificaciones a los Términos y a la Plataforma
Malva se reserva el derecho de actualizar, modificar o reemplazar cualquier parte de estos Términos del Servicio mediante la publicación de las actualizaciones en la Aplicación. Es su responsabilidad revisar periódicamente la Aplicación para verificar si existen cambios. El uso continuado o el acceso a la Aplicación tras la publicación de cualquier cambio constituye la aceptación implícita de dichos cambios.</Text>
       

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#050207",
    alignItems: "center",
    justifyContent: "center",
  },
  phoneShell: {
    width: 380,
    maxWidth: "92%",
    height: 760,
    backgroundColor: "#2a0f2f",
    borderRadius: 42,
    paddingVertical: 18,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 15,
    borderWidth: 4,
    borderColor: "#9b8ca1",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    color: "#4a0f51",
    fontSize: 28,
    fontWeight: "700",
  },
  closeText: {
    color: "#f2d5ff",
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  logoutButton: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "#f2d9ff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutIcon: {
    fontSize: 12,
    color: "#4a0f51",
  },
  brand: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "700",
    color: "#f5d8ff",
    fontStyle: "italic",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 40,
    marginBottom: 18,
    textShadowColor: "rgba(255,255,255,0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  bottomTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    paddingTop: 12,
    marginTop: "auto",
  },
 tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tabText: {
    color: "#f5dcff",
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.85,
  },
  tabTextActive: {
    color: "#f5dcff",
    fontSize: 12,
    fontWeight: "700",
  },
});