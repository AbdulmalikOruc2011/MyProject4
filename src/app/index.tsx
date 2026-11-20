import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Category = 'Fruits' | 'Meat' | 'Sweets' | 'Drinks';
type ThemeMode = 'dark' | 'light';

interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  inputBg: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentBorder: string;
  accentText: string;
  cartBadgeBg: string;
  cartBadgeText: string;
  tagBg: string;
  tagText: string;
  priceText: string;
  primaryBtn: string;
  primaryBtnText: string;
  danger: string;
}

const THEMES: Record<ThemeMode, ThemeColors> = {
  dark: {
    background: '#14110f',
    surface: '#1e1915',
    surfaceSecondary: '#231d19',
    inputBg: '#14110f',
    border: '#332b24',
    textPrimary: '#faf5ef',
    textSecondary: '#d6cbbd',
    textMuted: '#8c7f73',
    accent: '#f59e0b',
    accentBorder: '#fbbf24',
    accentText: '#181412',
    cartBadgeBg: '#231d19',
    cartBadgeText: '#fef3c7',
    tagBg: '#2b231d',
    tagText: '#fbbf24',
    priceText: '#34d399',
    primaryBtn: '#059669',
    primaryBtnText: '#ecfdf5',
    danger: '#fb7185',
  },
  light: {
    background: '#f7f4ef',
    surface: '#ffffff',
    surfaceSecondary: '#efeae1',
    inputBg: '#f9f7f3',
    border: '#e2d9cb',
    textPrimary: '#1c1917',
    textSecondary: '#44403c',
    textMuted: '#78716c',
    accent: '#d97706',
    accentBorder: '#b45309',
    accentText: '#ffffff',
    cartBadgeBg: '#fef3c7',
    cartBadgeText: '#78350f',
    tagBg: '#fef3c7',
    tagText: '#b45309',
    priceText: '#047857',
    primaryBtn: '#059669',
    primaryBtnText: '#ffffff',
    danger: '#e11d48',
  },
};

const CATEGORIES: { label: Category; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Fruits', icon: 'nutrition-outline' },
  { label: 'Meat', icon: 'flame-outline' },
  { label: 'Sweets', icon: 'ice-cream-outline' },
  { label: 'Drinks', icon: 'cafe-outline' },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Red Apple', price: 2.5, category: 'Fruits' },
  { id: '2', name: 'Banana', price: 3, category: 'Fruits' },
  { id: '3', name: 'Green Grapes', price: 4.2, category: 'Fruits' },
  { id: '4', name: 'Fresh Strawberry', price: 5.5, category: 'Fruits' },
  { id: '5', name: 'Sweet Peach', price: 3.8, category: 'Fruits' },
  { id: '6', name: 'Beef Steak', price: 14, category: 'Meat' },
  { id: '7', name: 'Chicken Fillet', price: 7.5, category: 'Meat' },
  { id: '8', name: 'Lamb Chops', price: 16.5, category: 'Meat' },
  { id: '9', name: 'Turkey Breast', price: 9.2, category: 'Meat' },
  { id: '10', name: 'Ground Beef', price: 11, category: 'Meat' },
  { id: '11', name: 'Dark Chocolate', price: 4, category: 'Sweets' },
  { id: '12', name: 'Honey Cake', price: 5.5, category: 'Sweets' },
  { id: '13', name: 'Pistachio Baklava', price: 8.5, category: 'Sweets' },
  { id: '14', name: 'Vanilla Croissant', price: 3.2, category: 'Sweets' },
  { id: '15', name: 'Caramel Tart', price: 4.8, category: 'Sweets' },
  { id: '16', name: 'Orange Juice', price: 3.5, category: 'Drinks' },
  { id: '17', name: 'Sparkling Water', price: 1.5, category: 'Drinks' },
  { id: '18', name: 'Iced Matcha Latte', price: 5, category: 'Drinks' },
  { id: '19', name: 'Cold Brew Coffee', price: 4.5, category: 'Drinks' },
  { id: '20', name: 'Pomegranate Juice', price: 4.2, category: 'Drinks' },
];

function formatPrice(value: number): string {
  return Number.isInteger(value) ? `${value}` : value.toFixed(2);
}

export default function SmartMarketScreen() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<Category>('Fruits');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  const colors = THEMES[themeMode];
  const isDark = themeMode === 'dark';

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleAddProduct = () => {
    const trimmedName = productName.trim();
    const parsedPrice = parseFloat(productPrice.replace(',', '.'));

    if (!trimmedName || isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid product name and price.');
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: trimmedName,
      price: parsedPrice,
      category: selectedCategory,
    };

    setProducts((prev) => [...prev, newProduct]);
    setProductName('');
    setProductPrice('');
  };

  const handleRemoveProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prev, { product, quantity: 1 }];
    });

    Alert.alert(
      'Added to Cart',
      `${product.name} (${formatPrice(product.price)} AZN) added to cart.`
    );
  };

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const sections = useMemo(() => {
    const filtered = products.filter((p) => p.category === selectedCategory);
    return [
      {
        title: selectedCategory,
        data: [filtered],
      },
    ];
  }, [products, selectedCategory]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Smart Market</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Curated daily pantry & fresh picks
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[
                styles.themeToggle,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={toggleTheme}
              activeOpacity={0.82}
            >
              <Ionicons
                name={isDark ? 'sunny' : 'moon'}
                size={17}
                color={colors.accent}
              />
              <Text style={[styles.themeToggleText, { color: colors.textPrimary }]}>
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </TouchableOpacity>

            <View
              style={[
                styles.cartBadge,
                {
                  backgroundColor: colors.cartBadgeBg,
                  borderColor: colors.accent,
                },
              ]}
            >
              <Ionicons name="bag-handle" size={18} color={colors.accent} />
              <Text style={[styles.cartText, { color: colors.cartBadgeText }]}>
                Cart: {totalItems} items / {formatPrice(totalPrice)} AZN
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.categoryWrapper}>
          <FlatList
            data={CATEGORIES}
            horizontal
            keyExtractor={(item) => item.label}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
            renderItem={({ item: { label, icon } }) => {
              const isActive = label === selectedCategory;
              return (
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isActive ? colors.accent : colors.surface,
                      borderColor: isActive ? colors.accentBorder : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedCategory(label)}
                  activeOpacity={0.82}
                >
                  <Ionicons
                    name={icon}
                    size={16}
                    color={isActive ? colors.accentText : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      { color: isActive ? colors.accentText : colors.textSecondary },
                      isActive && styles.categoryTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <View
          style={[
            styles.formCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.formTitle, { color: colors.textSecondary }]}>
            Add new item to {selectedCategory}
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                styles.nameInput,
                {
                  backgroundColor: colors.inputBg,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Product name..."
              placeholderTextColor={colors.textMuted}
              value={productName}
              onChangeText={setProductName}
              returnKeyType="next"
            />
            <TextInput
              style={[
                styles.input,
                styles.priceInput,
                {
                  backgroundColor: colors.inputBg,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Price (AZN)"
              placeholderTextColor={colors.textMuted}
              value={productPrice}
              onChangeText={setProductPrice}
              keyboardType="decimal-pad"
              returnKeyType="done"
              onSubmitEditing={handleAddProduct}
            />
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: colors.accent }]}
              onPress={handleAddProduct}
              activeOpacity={0.82}
            >
              <Ionicons name="add" size={22} color={colors.accentText} />
            </TouchableOpacity>
          </View>
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(_, index) => `section-row-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderSectionHeader={({ section }) => (
            <View style={[styles.sectionHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                {section.title}
              </Text>
              <View
                style={[
                  styles.countPill,
                  {
                    backgroundColor: colors.surfaceSecondary,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.sectionCount, { color: colors.textSecondary }]}>
                  {section.data[0]?.length ?? 0} items
                </Text>
              </View>
            </View>
          )}
          renderItem={({ item: rowProducts }) => (
            <View style={styles.gridContainer}>
              {rowProducts.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Ionicons name="storefront-outline" size={44} color={colors.textMuted} />
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                    No products in this category yet.
                  </Text>
                </View>
              ) : (
                rowProducts.map((product) => (
                  <View
                    key={product.id}
                    style={[
                      styles.card,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <View>
                      <View style={styles.cardTop}>
                        <View
                          style={[styles.categoryTag, { backgroundColor: colors.tagBg }]}
                        >
                          <Text
                            style={[styles.categoryTagText, { color: colors.tagText }]}
                          >
                            {product.category}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemoveProduct(product.id)}
                          style={styles.removeBtn}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={18}
                            color={colors.danger}
                          />
                        </TouchableOpacity>
                      </View>

                      <Text
                        style={[styles.productName, { color: colors.textPrimary }]}
                        numberOfLines={1}
                      >
                        {product.name}
                      </Text>
                      <Text style={[styles.productPrice, { color: colors.priceText }]}>
                        {formatPrice(product.price)} AZN
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.cartBtn, { backgroundColor: colors.primaryBtn }]}
                      onPress={() => handleAddToCart(product)}
                      activeOpacity={0.82}
                    >
                      <Ionicons name="add" size={18} color={colors.primaryBtnText} />
                      <Text
                        style={[styles.cartBtnText, { color: colors.primaryBtnText }]}
                      >
                        + Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 36,
    paddingHorizontal: 16,
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 3,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  themeToggleText: {
    fontSize: 13,
    fontWeight: '700',
  },
  cartBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  cartText: {
    fontSize: 13,
    fontWeight: '700',
  },
  categoryWrapper: {
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  categoryText: {
    fontWeight: '600',
    fontSize: 14,
  },
  categoryTextActive: {
    fontWeight: '700',
  },
  formCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    borderWidth: 1,
  },
  nameInput: {
    flex: 2.2,
  },
  priceInput: {
    flex: 1,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 36,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48.8%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTag: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  removeBtn: {
    padding: 4,
  },
  productName: {
    fontSize: 17,
    fontWeight: '700',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 14,
  },
  cartBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  cartBtnText: {
    fontWeight: '700',
    fontSize: 13,
  },
  emptyBox: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 52,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 10,
  },
});