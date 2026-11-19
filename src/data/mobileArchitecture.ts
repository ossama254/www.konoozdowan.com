export const FLUTTER_PROJECT_TREE = `rahiq_al_bustan_app/
├── android/
│   ├── app/
│   │   ├── google-services.json
│   │   └── src/main/AndroidManifest.xml  # Google Maps API Key & RTL support
├── assets/
│   ├── fonts/ (Cairo-Regular.ttf, Cairo-Bold.ttf)
│   └── images/
├── lib/
│   ├── main.dart                         # MaterialApp with Locale('ar') & RTL Directionality
│   ├── core/
│   │   ├── theme/app_theme.dart          # #D97706 Amber, #FFFBEB Cream, #4D7C0F Olive
│   │   ├── localization/app_localizations.dart
│   │   ├── network/dio_client.dart
│   │   └── di/injection_container.dart   # GetIt Clean Architecture wiring
│   ├── features/
│   │   ├── onboarding/
│   │   │   └── presentation/pages/splash_onboarding_page.dart
│   │   ├── catalog/
│   │   │   ├── domain/entities/product.dart
│   │   │   ├── domain/repositories/catalog_repository.dart
│   │   │   ├── data/datasources/catalog_remote_ds.dart
│   │   │   ├── data/models/product_model.dart
│   │   │   └── presentation/
│   │   │       ├── bloc/catalog_bloc.dart
│   │   │       ├── pages/home_page.dart
│   │   │       └── pages/product_details_page.dart
│   │   ├── cart_checkout/
│   │   │   ├── domain/entities/cart_item.dart
│   │   │   ├── presentation/bloc/cart_bloc.dart
│   │   │   ├── presentation/pages/cart_page.dart
│   │   │   ├── presentation/pages/checkout_page.dart
│   │   │   └── presentation/widgets/maps_address_picker.dart
│   │   ├── loyalty/
│   │   │   ├── domain/entities/loyalty_account.dart
│   │   │   ├── presentation/bloc/loyalty_bloc.dart
│   │   │   └── presentation/pages/loyalty_rewards_page.dart
│   │   └── orders_profile/
│   │       ├── domain/entities/order.dart
│   │       ├── presentation/bloc/orders_bloc.dart
│   │       └── presentation/pages/profile_orders_page.dart
└── pubspec.yaml                          # flutter_bloc, google_maps_flutter, firebase_messaging`;

export const REACT_NATIVE_PROJECT_TREE = `rahiq-al-bustan-rn/
├── android/app/src/main/AndroidManifest.xml
├── src/
│   ├── app/
│   │   ├── App.tsx                       # I18nManager.forceRTL(true) + NavigationContainer
│   │   └── store.ts                      # Redux Toolkit / Zustand stores
│   ├── domain/
│   │   ├── models/Product.ts
│   │   ├── models/Loyalty.ts
│   │   └── models/Order.ts
│   ├── services/
│   │   ├── firebase/firestoreService.ts  # Auth, Firestore, FCM push handlers
│   │   └── api/storeApi.ts               # REST endpoints adapter
│   ├── screens/
│   │   ├── OnboardingScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ProductDetailsScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── CheckoutScreen.tsx            # react-native-maps + Places Autocomplete
│   │   └── ProfileLoyaltyScreen.tsx
│   └── components/
│       ├── ProductCard.tsx
│       ├── WeightSelector.tsx
│       └── LoyaltyTierCard.tsx
└── package.json`;

export const FLUTTER_CORE_SNIPPETS: Record<string, { title: string; filename: string; code: string }> = {
  bloc: {
    title: 'Cart & Loyalty BLoC State Management',
    filename: 'lib/features/cart_checkout/presentation/bloc/cart_bloc.dart',
    code: `import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

/// Events for Cart & Loyalty Redemption
abstract class CartEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class AddToCart extends CartEvent {
  final String productId;
  final String weightId;
  final double unitPrice;
  final int quantity;
  AddToCart(this.productId, this.weightId, this.unitPrice, {this.quantity = 1});
}

class ApplyPromoCode extends CartEvent {
  final String code;
  ApplyPromoCode(this.code);
}

class RedeemLoyaltyReward extends CartEvent {
  final String rewardId;
  final int pointsCost;
  RedeemLoyaltyReward(this.rewardId, this.pointsCost);
}

/// Immutable Cart State with automatic shipping & loyalty points preview
class CartState extends Equatable {
  final List<CartItemEntity> items;
  final String? promoCode;
  final double discount;
  final int loyaltyPointsAvailable;

  const CartState({
    this.items = const [],
    this.promoCode,
    this.discount = 0,
    this.loyaltyPointsAvailable = 625,
  });

  double get subtotal => items.fold(0, (sum, i) => sum + (i.unitPrice * i.quantity));
  double get shippingFee => subtotal >= 250 || subtotal == 0 ? 0 : 25;
  double get total => (subtotal - discount).clamp(0, double.infinity) + shippingFee;
  int get estimatedPointsEarned => total.floor();

  @override
  List<Object?> get props => [items, promoCode, discount, loyaltyPointsAvailable];
}

class CartBloc extends Bloc<CartEvent, CartState> {
  CartBloc() : super(const CartState()) {
    on<AddToCart>((event, emit) {
      final updated = List<CartItemEntity>.from(state.items);
      final idx = updated.indexWhere((i) => i.productId == event.productId && i.weightId == event.weightId);
      if (idx >= 0) {
        updated[idx] = updated[idx].copyWith(quantity: updated[idx].quantity + event.quantity);
      } else {
        updated.add(CartItemEntity(
          productId: event.productId,
          weightId: event.weightId,
          unitPrice: event.unitPrice,
          quantity: event.quantity,
        ));
      }
      emit(CartState(
        items: updated,
        promoCode: state.promoCode,
        discount: state.discount,
        loyaltyPointsAvailable: state.loyaltyPointsAvailable,
      ));
    });
  }
}`,
  },
  home: {
    title: 'Home Screen (RTL, Banner Slider, Category Tabs)',
    filename: 'lib/features/catalog/presentation/pages/home_page.dart',
    code: `import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: const Color(0xFFFFFBEB), // Warm Cream
        appBar: AppBar(
          title: const Text('كنوز دوعن', style: TextStyle(fontFamily: 'Cairo', fontWeight: FontWeight.bold)),
          backgroundColor: const Color(0xFFFFFBEB),
          actions: [
            IconButton(icon: const Icon(Icons.shopping_bag_outlined), onPressed: () => Navigator.pushNamed(context, '/cart')),
          ],
        ),
        body: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(child: PromoBannerSlider()),
            SliverToBoxAdapter(child: CategoryFilterTabs()), // All, Honey, Raisins, Almonds, Bundles
            SliverPadding(
              padding: const EdgeInsets.all(16),
              sliver: BlocBuilder<CatalogBloc, CatalogState>(
                builder: (context, state) {
                  return SliverGrid.builder(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.74,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                    ),
                    itemCount: state.filteredProducts.length,
                    itemBuilder: (_, index) => ProductGridCard(product: state.filteredProducts[index]),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}`,
  },
  pdp: {
    title: 'Product Details (Dynamic Weight Selector & Lab Purity)',
    filename: 'lib/features/catalog/presentation/pages/product_details_page.dart',
    code: `class ProductDetailsPage extends StatefulWidget {
  final Product product;
  const ProductDetailsPage({super.key, required this.product});

  @override
  State<ProductDetailsPage> createState() => _ProductDetailsPageState();
}

class _ProductDetailsPageState extends State<ProductDetailsPage> {
  late WeightOption selectedWeight;

  @override
  void initState() {
    super.initState();
    selectedWeight = widget.product.weightOptions.first;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFFBEB),
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 340,
            flexibleSpace: InteractiveViewer(
              minScale: 1.0,
              maxScale: 3.0,
              child: Image.asset(widget.product.images.first, fit: BoxFit.cover),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(widget.product.origin, style: const TextStyle(color: Color(0xFF4D7C0F), fontWeight: FontWeight.w600)),
                  const SizedBox(height: 6),
                  Text(widget.product.name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 16),
                  // Dynamic Weight Selector (250g, 500g, 1kg, 3.5kg Half Gallon, 7kg Gallon)
                  Wrap(
                    spacing: 10,
                    children: widget.product.weightOptions.map((option) {
                      final isSelected = option.id == selectedWeight.id;
                      return ChoiceChip(
                        label: Text('\${option.label} — \${option.price} ر.ي'),
                        selected: isSelected,
                        selectedColor: const Color(0xFFD97706),
                        onSelected: (_) => setState(() => selectedWeight = option),
                      );
                    }).toList(),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFD97706), minimumSize: const Size.fromHeight(52)),
            onPressed: () => context.read<CartBloc>().add(AddToCart(widget.product.id, selectedWeight.id, selectedWeight.price)),
            child: Text('أضف للسلة · \${selectedWeight.price} ر.ي (اكسب \${selectedWeight.price.floor()} نقطة)'),
          ),
        ),
      ),
    );
  }
}`,
  },
  checkout: {
    title: 'Checkout & Google Maps Address Picker',
    filename: 'lib/features/cart_checkout/presentation/pages/checkout_page.dart',
    code: `// Integrates google_maps_flutter + Places Autocomplete + COD / Card / Wallet
class CheckoutPage extends StatelessWidget {
  const CheckoutPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('إتمام الطلب والتوصيل')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          SizedBox(
            height: 220,
            child: GoogleMap(
              initialCameraPosition: const CameraPosition(target: LatLng(24.7136, 46.6753), zoom: 13),
              onTap: (latLng) => context.read<CheckoutBloc>().add(UpdatePinLocation(latLng)),
            ),
          ),
          const SizedBox(height: 16),
          PaymentMethodSelector(), // Cash on Delivery, Mada/Visa, STC Pay
          LoyaltyPointsSummaryBanner(),
        ],
      ),
    );
  }
}`,
  },
};

export const ADMIN_API_ENDPOINTS = [
  {
    method: 'PATCH',
    path: '/api/v1/admin/products/:productId/weights',
    description: 'Update variant weight prices (250g/500g/1kg/3.5kg/7kg) and live inventory stock counts',
    payload: '{ "weightId": "w-500", "price": 275, "stock": 30 }',
  },
  {
    method: 'POST',
    path: '/api/v1/admin/coupons',
    description: 'Create promotional discount coupon with min spend and percentage/fixed rules',
    payload: '{ "code": "HARVEST20", "type": "percent", "value": 20, "minOrder": 200 }',
  },
  {
    method: 'POST',
    path: '/api/v1/loyalty/redeem',
    description: 'Atomically deduct user loyalty points and issue discount voucher or exclusive reward item',
    payload: '{ "userId": "usr_882", "rewardId": "rew-prod-mini-sidr" }',
  },
  {
    method: 'PATCH',
    path: '/api/v1/admin/orders/:orderId/status',
    description: 'Advance order status (pending -> confirmed -> out_for_delivery -> delivered) & trigger FCM push',
    payload: '{ "status": "out_for_delivery" }',
  },
  {
    method: 'POST',
    path: '/api/v1/admin/notifications/broadcast',
    description: 'Send localized Arabic/English push notifications via Firebase Cloud Messaging topics',
    payload: '{ "segment": "gold_royal", "titleAr": "حصاد السدر وصل", "bodyAr": "خصم حصري لأعضاء الولاء" }',
  },
];
