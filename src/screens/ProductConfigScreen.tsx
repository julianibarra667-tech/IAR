import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Product, useProducts } from "../context/ProductsContext";
import { useTheme } from "../context/ThemeContext";
import { createProduct, deleteProduct } from "../services/product.service";

type RootStackParamList = {
  ProductConfigScreen: undefined;
  SettingsScreen: undefined;
};

type ProductConfigScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ProductConfigScreen"
>;

export function ProductConfigScreen({ navigation }: ProductConfigScreenProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [points, setPoints] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const {
    products,
    isLoading,
    loadError,
    addProduct,
    removeProduct,
    reloadProducts,
  } = useProducts();
  const { theme, colors } = useTheme();

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo abrir la galería de imágenes.";
      Alert.alert("Error al elegir la imagen", message);
    }
  };

  const handleAddProduct = async () => {
    const parsedPrice = Number(price);
    const parsedPoints = Number(points);

    if (!name.trim() || !price.trim() || !points.trim()) {
      Alert.alert("Datos incompletos", "Completa todos los campos del producto.");
      return;
    }

    if (
      !Number.isFinite(parsedPrice) ||
      parsedPrice <= 0 ||
      !Number.isInteger(parsedPoints) ||
      parsedPoints < 0
    ) {
      Alert.alert(
        "Datos no válidos",
        "Ingresa un precio mayor a cero y puntos válidos."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const newProduct = await createProduct({
        name: name.trim(),
        price: parsedPrice,
        points: parsedPoints,
        imageUri,
      });
      addProduct(newProduct);
      setName("");
      setPrice("");
      setPoints("");
      setImageUri(null);
      Alert.alert("Producto agregado", "El producto se creó correctamente.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo conectar con la API de productos.";
      Alert.alert("No se pudo agregar el producto", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteProduct = async (product: Product) => {
    setDeletingProductId(product.id);
    try {
      await deleteProduct(product.id);
      removeProduct(product.id);
      Alert.alert("Producto eliminado", `${product.name} se eliminó correctamente.`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo conectar con la API de productos.";
      Alert.alert("No se pudo eliminar el producto", message);
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      "Eliminar producto",
      `¿Seguro que deseas eliminar "${product.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            void confirmDeleteProduct(product);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.screen }]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      <View style={[styles.phoneShell, { backgroundColor: colors.shell, borderColor: colors.border }]}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Volver a ajustes"
          >
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
          <Text style={[styles.brand, { color: colors.text }]}>Malva</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Configurar productos</Text>
        <Text style={[styles.subtitle, { color: colors.mutedText }]}>Agrega productos al catálogo</Text>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.label, { color: colors.label }]}>Nombre del producto</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.inputText }]}
            placeholder="Ej. Gin Tonic"
            placeholderTextColor="#a18bb8"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="next"
            accessibilityLabel="Nombre del producto"
          />

          <Text style={[styles.label, { color: colors.label }]}>Precio</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.inputText }]}
            placeholder="Ej. 25000"
            placeholderTextColor="#a18bb8"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            returnKeyType="next"
            accessibilityLabel="Precio"
          />

          <Text style={[styles.label, { color: colors.label }]}>Puntos</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.inputText }]}
            placeholder="Ej. 25"
            placeholderTextColor="#a18bb8"
            value={points}
            onChangeText={setPoints}
            keyboardType="number-pad"
            returnKeyType="done"
            accessibilityLabel="Puntos"
          />

          <Text style={[styles.label, { color: colors.label }]}>Imagen del producto</Text>
          <Pressable
            style={[
              styles.imagePickerButton,
              { backgroundColor: colors.subtleSurface, borderColor: colors.accent },
            ]}
            onPress={handlePickImage}
            accessibilityRole="button"
          >
            <Text style={[styles.imagePickerButtonText, { color: colors.text }]}>
              {imageUri ? "Cambiar imagen" : "Elegir imagen desde la galería"}
            </Text>
          </Pressable>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.imagePreview}
              accessibilityLabel="Vista previa de la imagen del producto"
            />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.subtleSurface, borderColor: colors.border }]}>
              <Text style={[styles.placeholderText, { color: colors.mutedText }]}>Vista previa de la imagen</Text>
            </View>
          )}

          <Pressable
            style={[
              styles.addButton,
              { backgroundColor: colors.accent },
              isSubmitting && styles.disabledButton,
            ]}
            onPress={handleAddProduct}
            disabled={isSubmitting}
            accessibilityRole="button"
          >
            <Text style={[styles.addButtonText, { color: colors.accentText }]}>
              {isSubmitting ? "Guardando..." : "Agregar producto"}
            </Text>
          </Pressable>

          <Text style={[styles.listTitle, { color: colors.text }]}>Productos agregados</Text>
          {loadError ? (
            <View>
              <Text style={[styles.emptyText, { color: colors.error }]}>{loadError}</Text>
              <Pressable onPress={() => void reloadProducts().catch(() => undefined)}>
                <Text style={[styles.emptyText, { color: colors.text }]}>Reintentar</Text>
              </Pressable>
            </View>
          ) : null}
          {isLoading ? (
            <Text style={[styles.emptyText, { color: colors.mutedText }]}>
              Cargando productos...
            </Text>
          ) : null}
          {!isLoading && products.length === 0 && !loadError ? (
            <Text style={[styles.emptyText, { color: colors.mutedText }]}>
              Aún no hay productos agregados.
            </Text>
          ) : null}
          {!isLoading && products.length > 0 ? (
            products.map((product) => (
              <View key={product.id} style={[styles.productCard, { backgroundColor: colors.subtleSurface }]}>
                {product.imageUri ? (
                  <Image
                    source={{ uri: product.imageUri }}
                    style={styles.productImage}
                    accessibilityLabel={`Imagen de ${product.name}`}
                  />
                ) : (
                  <View style={styles.productImagePlaceholder}>
                    <Text style={[styles.placeholderText, { color: colors.mutedText }]}>Foto</Text>
                  </View>
                )}
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
                  <Text style={[styles.productDetails, { color: colors.mutedText }]}>
                    ${product.price.toLocaleString()} · {product.points} puntos
                  </Text>
                </View>
                <Pressable
                  style={[
                    styles.deleteButton,
                    deletingProductId === product.id && styles.disabledButton,
                  ]}
                  onPress={() => handleDeleteProduct(product)}
                  disabled={deletingProductId !== null}
                  accessibilityRole="button"
                  accessibilityLabel={`Eliminar ${product.name}`}
                >
                  <Text style={styles.deleteButtonText}>
                    {deletingProductId === product.id ? "..." : "Eliminar"}
                  </Text>
                </Pressable>
              </View>
            ))
          ) : null}
        </ScrollView>
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
    maxHeight: "96%",
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
  brand: {
    flex: 1,
    textAlign: "center",
    fontSize: 38,
    fontWeight: "700",
    color: "#f5d8ff",
    fontStyle: "italic",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    paddingVertical: 7,
    marginHorizontal: 12,
    textShadowColor: "rgba(255,255,255,0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  headerSpacer: {
    width: 42,
  },
  title: {
    color: "#f7d8ff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    color: "#f2d5ff",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 14,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 6,
    paddingBottom: 16,
  },
  label: {
    alignSelf: "flex-start",
    color: "#f0d8ff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 7,
  },
  input: {
    width: "100%",
    backgroundColor: "#f0edf1",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2b1b31",
  },
  imagePickerButton: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "#d89ce8",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 4,
  },
  imagePickerButtonText: {
    color: "#f5dcff",
    fontSize: 15,
    fontWeight: "700",
  },
  imagePreview: {
    width: "100%",
    height: 150,
    borderRadius: 14,
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  imagePlaceholder: {
    width: "100%",
    height: 150,
    borderRadius: 14,
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(245,220,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "#5F0365",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.65,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  listTitle: {
    color: "#f7d8ff",
    fontSize: 19,
    fontWeight: "700",
    marginTop: 22,
    marginBottom: 10,
  },
  emptyText: {
    color: "#f2d5ff",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 16,
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  productImage: {
    width: 58,
    height: 58,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  productImagePlaceholder: {
    width: 58,
    height: 58,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#e4c5ef",
    fontSize: 12,
  },
  productInfo: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "#8b2441",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  productName: {
    color: "#f5dcff",
    fontSize: 16,
    fontWeight: "700",
  },
  productDetails: {
    color: "#e4c5ef",
    fontSize: 14,
    marginTop: 4,
  },
});
