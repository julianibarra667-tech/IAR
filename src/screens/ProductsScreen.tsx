import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

type RootStackParamList = {
  ProfileScreen: undefined;
  ProductsScreen: undefined;
  LoginScreen: undefined;
  RewardsScreen: undefined;
  SettingsScreen: undefined;
};

type Product = {
  id: number;
  name: string;
  price: number;
  points: number;
  image: string;
};

type ProductsScreenProps = NativeStackScreenProps<RootStackParamList, "ProductsScreen">;

const products: Product[] = [
  { id: 1, name: "Gin Tonic", price: 8000, points: 80, image: "Image" },
  { id: 2, name: "Margarita Tradicional", price: 8000, points: 75, image: "Image" },
  { id: 3, name: "Mojito", price: 25000, points: 25, image: "Image" },
  { id: 4, name: "Moscow Mule", price: 40000, points: 40, image: "Image" },
];

export function ProductsScreen({ navigation }: ProductsScreenProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<Product[]>([
    { id: 2, name: "Margarita Tradicional", price: 75000, points: 75, image: "Image" },
    { id: 2, name: "Margarita Tradicional", price: 75000, points: 75, image: "Image" },
    { id: 5, name: "Margarita de Maracuya", price: 80000, points: 80, image: "Image" },
  ]);

  const totalPrice = useMemo(
    () => cart.reduce((sum, product) => sum + product.price, 0),
    [cart]
  );

  const totalPoints = useMemo(
    () => cart.reduce((sum, product) => sum + product.points, 0),
    [cart]
  );

  const addToCart = (product: Product) => {
    setCart((current) => [...current, product]);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <View style={styles.phoneShell}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>

          <Text style={styles.brand}>Malva</Text>

          <Pressable style={styles.cartToggle} onPress={() => setIsCartOpen((value) => !value)}>
            <Text style={styles.cartIcon}>🛒</Text>
          </Pressable>
        </View>

        {isCartOpen && (
          <View style={styles.cartPanel}>
            
            {cart.map((product, index) => (
              <View key={`${product.name}-${index}`} style={styles.cartItem}>
                <View style={styles.cartThumb}>
                  <Text style={styles.thumbText}>Image</Text>
                </View>

                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartName}>{product.name}</Text>
                  <Text style={styles.cartPrice}>${product.price.toLocaleString()}</Text>
                </View>

                <View style={styles.pointsBadge}>
                  <Text style={styles.pointsText}>+{product.points} Pts</Text>
                </View>
              </View>
            ))}

            <View style={styles.cartTotalRow}>
              <Text style={styles.cartTotalLabel}>Total: ${totalPrice.toLocaleString()}</Text>
              <Text style={styles.cartTotalPoints}>Total Pts: +{totalPoints} Pts</Text>
            </View>

            <Pressable style={styles.payButton}>
              <Text style={styles.payText}>PAGAR</Text>
            </Pressable>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.productsGrid} showsVerticalScrollIndicator={false}>
          {products.map((product) => (
            <Pressable key={product.id} style={styles.productCard} onPress={() => addToCart(product)}>
              <View style={styles.productImage}>
                <Text style={styles.productImageText}>{product.image}</Text>
              </View>

              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>${product.price.toLocaleString()}</Text>

              <View style={styles.productPoints}>
                <Text style={styles.productPointsText}>+{product.points} Pts</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.bottomTabs}>
          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("ProfileScreen")}>
            <Text style={styles.tabText}>Perfil</Text>
          </Pressable>

          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("ProductsScreen")}>
            <Text style={styles.tabText}>Productos</Text>
          </Pressable>

          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("RewardsScreen")}>
            <Text style={styles.tabText}>Premios</Text>
          </Pressable>

          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("SettingsScreen")}>
            <Text style={styles.tabText}>Ajustes</Text>
          </Pressable>
        </View>
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
    marginRight: 6,
  },
  backIcon: {
    color: "#4a0f51",
    fontSize: 28,
    fontWeight: "700",
  },
  brand: {
    flex: 1,
    textAlign: "center",
    fontSize: 44,
    fontWeight: "700",
    color: "#f5d8ff",
    fontStyle: "italic",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    paddingVertical: 10,
    marginHorizontal: 10,
    textShadowColor: "rgba(255,255,255,0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  cartToggle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#f2d9ff",
    alignItems: "center",
    justifyContent: "center",
  },
  cartIcon: {
    fontSize: 18,
  },
  cartPanel: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5e1d68",
    borderRadius: 12,
    padding: 8,
    marginBottom: 10,
  },
  cartThumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: "#d8d8d8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  thumbText: {
    color: "#5a4a5d",
    fontSize: 10,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartName: {
    color: "#f5dcff",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 2,
  },
  cartPrice: {
    color: "#f5dcff",
    fontSize: 13,
  },
  pointsBadge: {
    backgroundColor: "#e7d86a",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginLeft: 8,
  },
  pointsText: {
    color: "#3a2a0c",
    fontSize: 10,
    fontWeight: "700",
  },
  cartTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 12,
  },
  cartTotalLabel: {
    color: "#f5dcff",
    fontSize: 15,
    fontWeight: "700",
  },
  cartTotalPoints: {
    color: "#f5dcff",
    fontSize: 15,
    fontWeight: "700",
  },
  payButton: {
    backgroundColor: "#d89ce8",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  payText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  productsGrid: {
    paddingTop: 8,
    paddingBottom: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    backgroundColor: "#4a1a58",
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  productImage: {
    width: "100%",
    height: 90,
    borderRadius: 10,
    backgroundColor: "#d9d9d9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  productImageText: {
    color: "#5d4d60",
    fontSize: 12,
  },
  productName: {
    color: "#f5dcff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    minHeight: 32,
  },
  productPrice: {
    color: "#f5dcff",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },
  productPoints: {
    backgroundColor: "#f1d27a",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
  },
  productPointsText: {
    color: "#34260b",
    fontSize: 10,
    fontWeight: "800",
  },
  bottomTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    paddingTop: 12,
    marginTop: 6,
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
});