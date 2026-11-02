import { u as useI18n, a as useHead, b as useSeoMeta, c as useCartStore, s as ssrRenderList$2, _ as _sfc_main$2, d as useProducts, P as ProductCard_default } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, unref, ref, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderTeleport, ssrRenderStyle } from 'vue/server-renderer';
import { Heart, ShoppingBag, Menu, X, Sparkles, ArrowRight, HelpCircle, ArrowUp, RotateCcw } from 'lucide-vue-next';
import 'nostics';
import 'nostics/formatters/ansi';
import 'unhead/plugins';
import 'unhead/utils';
import '../_/nitro.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'ipx';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'pinia';
import 'vue-router';

// app/components/AppHeader.vue?vue&type=script&setup=true&lang.ts
var AppHeader_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AppHeader",
	__ssrInlineRender: true,
	setup(__props) {
		const cartStore = useCartStore();
		const { locale, t } = useI18n();
		const isScrolled = ref(false);
		const mobileMenuOpen = ref(false);
		const activeNav = ref("#hero");
		const navItems = computed(() => [
			{
				name: t.value.nav.home,
				href: "#hero"
			},
			{
				name: t.value.nav.menu,
				href: "#menu"
			},
			{
				name: t.value.nav.about,
				href: "#about"
			},
			{
				name: t.value.nav.reviews,
				href: "#reviews"
			},
			{
				name: t.value.nav.promo,
				href: "#promo"
			}
		]);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<header${ssrRenderAttrs(mergeProps({ class: ["fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-3.5 px-4 sm:px-8", isScrolled.value ? "backdrop-blur-xl bg-coffee-darkest/75 border-b border-coffee-sand/10 shadow-lg py-3" : "bg-transparent"] }, _attrs))}><div class="max-w-7xl mx-auto flex items-center justify-between gap-4"><a href="#hero" class="flex items-center gap-2.5 group select-none cursor-pointer"><div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-coffee-mid/80 border border-coffee-sand/30 flex items-center justify-center text-teal-accent group-hover:scale-110 group-hover:border-teal-accent transition-all duration-300 shadow-md"><svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M4 19h16v2H4v-2zm14-9V5H2v10a4 4 0 004 4h8a4 4 0 004-4v-2h2a3 3 0 003-3v-2a3 3 0 00-3-3h-2zm0 3h2a1 1 0 011 1v2a1 1 0 01-1 1h-2v-4zM4 7h12v8a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"></path><path d="M7 2h2v2H7zm4 0h2v2h-2z" opacity="0.75"></path></svg></div><div class="flex flex-col"><span class="text-base sm:text-lg font-extrabold text-coffee-sand group-hover:text-coffee-caramel tracking-wide leading-tight font-khmer"> ស្នេហ៍កាហ្វេ </span><span class="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-teal-accent/90 -mt-0.5"> Sne Kafe </span></div></a><nav class="hidden md:flex items-center gap-1.5 px-6 py-2.5 rounded-full glass-pill shadow-glass"><!--[-->`);
			ssrRenderList$2(navItems.value, (item) => {
				_push(`<a${ssrRenderAttr("href", item.href)} class="${ssrRenderClass([activeNav.value === item.href ? "text-teal-accent font-semibold" : "text-coffee-muted hover:text-coffee-sand", "relative px-3.5 py-1.5 text-xs lg:text-sm font-medium transition-colors cursor-pointer"])}">${ssrInterpolate(item.name)} `);
				if (activeNav.value === item.href) _push(`<span class="absolute bottom-0 left-3 right-3 h-0.5 bg-teal-accent rounded-full animate-fadeIn"></span>`);
				else _push(`<!---->`);
				_push(`</a>`);
			});
			_push(`<!--]--></nav><div class="flex items-center gap-2 sm:gap-3"><div class="flex items-center p-1 rounded-full bg-coffee-dark/80 border border-coffee-sand/20 text-xs"><button type="button" class="${ssrRenderClass([unref(locale) === "km" ? "bg-teal-accent text-teal-darkText shadow-sm" : "text-coffee-muted hover:text-coffee-sand", "px-2.5 py-1 rounded-full font-bold transition-all duration-200"])}" title="ភាសាខ្មែរ (Khmer)"> ខ្មែរ </button><button type="button" class="${ssrRenderClass([unref(locale) === "en" ? "bg-teal-accent text-teal-darkText shadow-sm" : "text-coffee-muted hover:text-coffee-sand", "px-2.5 py-1 rounded-full font-bold transition-all duration-200"])}" title="English"> EN </button></div><button type="button" class="relative p-2.5 rounded-full text-coffee-sand hover:text-teal-accent hover:bg-coffee-mid/50 transition-all cursor-pointer"${ssrRenderAttr("title", unref(locale) === "km" ? "បញ្ជីចូលចិត្ត" : "Favorites")}>`);
			_push(ssrRenderComponent(unref(Heart), { class: ["w-5 h-5", { "fill-red-500 text-red-500": unref(cartStore).favorites.length > 0 }] }, null, _parent));
			if (unref(cartStore).favorites.length > 0) _push(`<span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">${ssrInterpolate(unref(cartStore).favorites.length)}</span>`);
			else _push(`<!---->`);
			_push(`</button><button type="button" class="relative p-2.5 rounded-full text-coffee-sand hover:text-teal-accent hover:bg-coffee-mid/50 transition-all"${ssrRenderAttr("title", unref(t).cart.title)}>`);
			_push(ssrRenderComponent(unref(ShoppingBag), { class: "w-5 h-5" }, null, _parent));
			if (unref(cartStore).totalItems > 0) _push(`<span class="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-teal-accent text-teal-darkText text-[10px] font-extrabold flex items-center justify-center leading-none animate-pulse">${ssrInterpolate(unref(cartStore).totalItems)}</span>`);
			else _push(`<!---->`);
			_push(`</button><button type="button" class="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-teal-accent hover:bg-teal-hover text-teal-darkText font-semibold text-xs lg:text-sm tracking-wide shadow-md transition-all duration-200 hover:scale-105 active:scale-95">${ssrInterpolate(unref(t).nav.orderBtn)}</button><button type="button" class="md:hidden p-2 text-coffee-sand hover:text-teal-accent rounded-lg focus:outline-none" aria-label="Toggle navigation menu">`);
			if (!mobileMenuOpen.value) _push(ssrRenderComponent(unref(Menu), { class: "w-6 h-6" }, null, _parent));
			else _push(ssrRenderComponent(unref(X), { class: "w-6 h-6" }, null, _parent));
			_push(`</button></div></div>`);
			if (mobileMenuOpen.value) {
				_push(`<div class="md:hidden mt-3 p-4 rounded-2xl glass-card backdrop-blur-2xl border border-coffee-sand/20 space-y-2"><!--[-->`);
				ssrRenderList$2(navItems.value, (item) => {
					_push(`<a${ssrRenderAttr("href", item.href)} class="${ssrRenderClass([activeNav.value === item.href ? "bg-coffee-sand/15 text-teal-accent font-semibold" : "text-coffee-muted hover:text-coffee-sand", "block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"])}">${ssrInterpolate(item.name)}</a>`);
				});
				_push(`<!--]--><div class="flex items-center justify-between px-4 py-2.5 rounded-xl bg-coffee-dark/60 text-xs"><span class="text-coffee-muted">ភាសា / Language:</span><div class="flex items-center gap-1"><button type="button" class="${ssrRenderClass([unref(locale) === "km" ? "bg-teal-accent text-teal-darkText" : "text-coffee-muted", "px-3 py-1 rounded-full font-bold"])}"> ខ្មែរ </button><button type="button" class="${ssrRenderClass([unref(locale) === "en" ? "bg-teal-accent text-teal-darkText" : "text-coffee-muted", "px-3 py-1 rounded-full font-bold"])}"> EN </button></div></div><div class="pt-2 border-t border-coffee-sand/10 space-y-2"><button type="button" class="w-full py-2.5 rounded-full bg-teal-accent text-teal-darkText font-semibold text-sm shadow-md">${ssrInterpolate(unref(t).nav.orderBtn)}</button><button type="button" class="w-full py-2 rounded-full border border-coffee-sand/20 hover:border-coffee-sand/50 text-coffee-sand font-medium text-xs flex items-center justify-center gap-2 transition-colors">`);
				_push(ssrRenderComponent(unref(Heart), { class: "w-3.5 h-3.5 fill-red-500 text-red-500" }, null, _parent));
				_push(`<span>${ssrInterpolate(unref(t).favorites.title)} (${ssrInterpolate(unref(cartStore).favorites.length)})</span></button></div></div>`);
			} else _push(`<!---->`);
			_push(`</header>`);
		};
	}
});
// app/components/AppHeader.vue
var _sfc_setup$7 = AppHeader_vue_vue_type_script_setup_true_lang_default.setup;
AppHeader_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppHeader.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var AppHeader_default = Object.assign(AppHeader_vue_vue_type_script_setup_true_lang_default, { __name: "AppHeader" });
// app/components/HeroSection.vue?vue&type=script&setup=true&lang.ts
var HeroSection_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "HeroSection",
	__ssrInlineRender: true,
	setup(__props) {
		const { t, isKhmer } = useI18n();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtImg = _sfc_main$2;
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "hero",
				class: "relative min-h-[92vh] flex items-center pt-28 pb-16 sm:pt-32 sm:pb-24 overflow-hidden"
			}, _attrs))}><div class="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0"><span class="watermark-text transform -rotate-6 translate-y-12"> SNE KAFE </span></div><div class="absolute top-20 left-8 sm:left-24 w-12 sm:w-16 opacity-60 animate-float pointer-events-none z-10">`);
			_push(ssrRenderComponent(_component_NuxtImg, {
				src: "/images/coffee-beans.svg",
				alt: "Coffee Beans",
				width: "64",
				height: "64",
				class: "w-full h-auto filter drop-shadow-lg"
			}, null, _parent));
			_push(`</div><div class="absolute bottom-24 left-1/4 w-10 sm:w-14 opacity-40 animate-float-slow pointer-events-none z-10">`);
			_push(ssrRenderComponent(_component_NuxtImg, {
				src: "/images/coffee-beans.svg",
				alt: "Coffee Beans",
				width: "56",
				height: "56",
				class: "w-full h-auto filter drop-shadow-md rotate-45"
			}, null, _parent));
			_push(`</div><div class="absolute top-36 right-10 sm:right-28 w-14 sm:w-20 opacity-55 animate-float-reverse pointer-events-none z-10">`);
			_push(ssrRenderComponent(_component_NuxtImg, {
				src: "/images/coffee-beans.svg",
				alt: "Coffee Beans",
				width: "80",
				height: "80",
				class: "w-full h-auto filter drop-shadow-lg -rotate-12"
			}, null, _parent));
			_push(`</div><div class="max-w-7xl mx-auto px-4 sm:px-8 w-full relative z-20"><div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"><div class="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left"><div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-xs font-medium text-coffee-sand border border-coffee-sand/20 shadow-sm">`);
			_push(ssrRenderComponent(unref(Sparkles), { class: "w-3.5 h-3.5 text-teal-accent animate-pulse" }, null, _parent));
			_push(`<span>${ssrInterpolate(unref(t).hero.tag)}</span></div><h1 class="${ssrRenderClass([unref(isKhmer) ? "font-khmer" : "", "text-3xl sm:text-5xl lg:text-6xl font-extrabold text-coffee-sand tracking-tight leading-[1.25]"])}">${ssrInterpolate(unref(t).hero.title1)} <span class="text-transparent bg-clip-text bg-gradient-to-r from-coffee-sand via-coffee-caramel to-teal-accent">${ssrInterpolate(unref(t).hero.titleHighlight)}</span> ${ssrInterpolate(unref(t).hero.title2)}</h1><p class="${ssrRenderClass([unref(isKhmer) ? "font-khmer leading-loose" : "", "text-coffee-muted text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal"])}">${ssrInterpolate(unref(t).hero.description)}</p><div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"><button type="button" class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-teal-accent hover:bg-teal-hover text-teal-darkText font-bold text-sm sm:text-base tracking-wide shadow-glow transition-all duration-300 hover:scale-105 active:scale-95 group"><span>${ssrInterpolate(unref(t).hero.btnChoose)}</span>`);
			_push(ssrRenderComponent(unref(ArrowRight), { class: "w-4 h-4 transition-transform group-hover:translate-x-1" }, null, _parent));
			_push(`</button><a href="#about" class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-full text-coffee-sand hover:text-white font-medium text-sm transition-colors border border-coffee-sand/20 hover:border-coffee-sand/50">${ssrInterpolate(unref(t).hero.btnAbout)}</a></div><div class="grid grid-cols-3 gap-4 pt-4 sm:pt-6 border-t border-coffee-sand/10 max-w-lg mx-auto lg:mx-0"><div><p class="text-xl sm:text-2xl font-bold text-coffee-sand">${ssrInterpolate(unref(t).hero.statVarieties)}</p><p class="text-xs text-coffee-muted mt-0.5">${ssrInterpolate(unref(t).hero.statVarietiesLabel)}</p></div><div><p class="text-xl sm:text-2xl font-bold text-coffee-sand">${ssrInterpolate(unref(t).hero.statBeans)}</p><p class="text-xs text-coffee-muted mt-0.5">${ssrInterpolate(unref(t).hero.statBeansLabel)}</p></div><div><p class="text-xl sm:text-2xl font-bold text-coffee-sand">${ssrInterpolate(unref(t).hero.statRating)}</p><p class="text-xs text-coffee-muted mt-0.5">${ssrInterpolate(unref(t).hero.statRatingLabel)}</p></div></div></div><div class="lg:col-span-6 relative flex items-center justify-center pt-6 lg:pt-0"><div class="absolute w-80 h-80 sm:w-[500px] sm:h-[500px] rounded-full bg-coffee-sand/20 blur-3xl -z-10 animate-pulseGlow pointer-events-none"></div><div class="absolute inset-0 flex items-center justify-center -z-10 scale-125 sm:scale-150 opacity-80 pointer-events-none">`);
			_push(ssrRenderComponent(_component_NuxtImg, {
				src: "/images/coffee-splash.svg",
				alt: "Coffee splash",
				width: "600",
				height: "600",
				class: "w-full max-w-[480px] sm:max-w-[580px] h-auto object-contain"
			}, null, _parent));
			_push(`</div><div class="relative w-full max-w-[460px] sm:max-w-[540px] lg:max-w-[620px] h-[380px] sm:h-[480px] lg:h-[560px] flex items-center justify-center"><div class="absolute -left-2 sm:-left-6 bottom-4 sm:bottom-10 w-64 sm:w-80 lg:w-[350px] animate-float-slow transform -rotate-6">`);
			_push(ssrRenderComponent(_component_NuxtImg, {
				src: "/images/cup-hero-cream.svg",
				alt: "Sne Kafe ceramic mug",
				width: "400",
				height: "460",
				class: "w-full h-auto filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.65)]"
			}, null, _parent));
			_push(`</div><div class="absolute right-0 sm:right-2 top-0 w-72 sm:w-96 lg:w-[420px] animate-float transform rotate-6 z-10">`);
			_push(ssrRenderComponent(_component_NuxtImg, {
				src: "/images/cup-hero-brown.svg",
				alt: "Sne Kafe takeaway coffee cup",
				width: "440",
				height: "520",
				class: "w-full h-auto filter drop-shadow-[0_30px_45px_rgba(0,0,0,0.75)]"
			}, null, _parent));
			_push(`</div></div></div></div></div></section>`);
		};
	}
});
// app/components/HeroSection.vue
var _sfc_setup$6 = HeroSection_vue_vue_type_script_setup_true_lang_default.setup;
HeroSection_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HeroSection.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var HeroSection_default = Object.assign(HeroSection_vue_vue_type_script_setup_true_lang_default, { __name: "HeroSection" });
// app/components/ProductList.vue?vue&type=script&setup=true&lang.ts
var ProductList_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ProductList",
	__ssrInlineRender: true,
	setup(__props) {
		const { featuredProducts } = useProducts();
		useCartStore();
		const { t, isKhmer } = useI18n();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_ProductCard = ProductCard_default;
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "menu",
				class: "relative py-20 sm:py-28 overflow-hidden"
			}, _attrs))}><div class="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0"><span class="watermark-text transform rotate-3"> COFFEE </span></div><div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-10"><div class="text-center max-w-2xl mx-auto mb-8 sm:mb-14"><div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-pill text-xs font-semibold text-teal-accent mb-3">`);
			_push(ssrRenderComponent(unref(Sparkles), { class: "w-3.5 h-3.5" }, null, _parent));
			_push(`<span>${ssrInterpolate(unref(t).menu.tag)}</span></div><h2 class="${ssrRenderClass([unref(isKhmer) ? "font-khmer" : "", "text-3xl sm:text-4xl lg:text-5xl font-extrabold text-coffee-sand tracking-tight"])}">${ssrInterpolate(unref(t).menu.title)}</h2><p class="${ssrRenderClass([unref(isKhmer) ? "font-khmer leading-relaxed" : "", "text-xs sm:text-sm text-coffee-muted mt-3"])}">${ssrInterpolate(unref(t).menu.description)}</p></div><div class="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 overflow-x-auto pb-4 snap-x"><!--[-->`);
			ssrRenderList$2(unref(featuredProducts), (product) => {
				_push(`<div class="snap-center">`);
				_push(ssrRenderComponent(_component_ProductCard, { product }, null, _parent));
				_push(`</div>`);
			});
			_push(`<!--]--></div><div class="mt-14 sm:mt-18 text-center"><button type="button" class="inline-flex items-center gap-1.5 text-[#D9A87C] hover:text-teal-accent font-medium text-sm sm:text-base border-b border-[#D9A87C]/60 hover:border-teal-accent pb-0.5 transition-all group cursor-pointer"><span class="${ssrRenderClass(unref(isKhmer) ? "font-khmer" : "")}">${ssrInterpolate(unref(t).menu.viewMenu)}</span><span class="transition-transform duration-200 group-hover:translate-x-1">→</span></button></div></div></section>`);
		};
	}
});
// app/components/ProductList.vue
var _sfc_setup$5 = ProductList_vue_vue_type_script_setup_true_lang_default.setup;
ProductList_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProductList.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var ProductList_default = Object.assign(ProductList_vue_vue_type_script_setup_true_lang_default, { __name: "ProductList" });
// app/components/AboutSection.vue?vue&type=script&setup=true&lang.ts
var AboutSection_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AboutSection",
	__ssrInlineRender: true,
	setup(__props) {
		useCartStore();
		const { t, isKhmer } = useI18n();
		const features = computed(() => [
			{
				num: "01",
				title: t.value.about.f1Title,
				description: t.value.about.f1Desc,
				side: "left"
			},
			{
				num: "02",
				title: t.value.about.f2Title,
				description: t.value.about.f2Desc,
				side: "left"
			},
			{
				num: "03",
				title: t.value.about.f3Title,
				description: t.value.about.f3Desc,
				side: "right"
			},
			{
				num: "04",
				title: t.value.about.f4Title,
				description: t.value.about.f4Desc,
				side: "right"
			}
		]);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtImg = _sfc_main$2;
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "about",
				class: "relative py-20 sm:py-28 overflow-hidden"
			}, _attrs))}><div class="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0"><span class="watermark-text transform -rotate-3"> ABOUT </span></div><div class="absolute bottom-6 right-6 sm:right-16 w-24 sm:w-36 opacity-60 animate-float-slow pointer-events-none z-10">`);
			_push(ssrRenderComponent(_component_NuxtImg, {
				src: "/images/coffee-beans.svg",
				alt: "Coffee Beans",
				width: "144",
				height: "144",
				class: "w-full h-auto filter drop-shadow-xl rotate-12"
			}, null, _parent));
			_push(`</div><div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-20"><div class="text-center mb-16 sm:mb-20"><h2 class="${ssrRenderClass([unref(isKhmer) ? "font-khmer" : "", "text-3xl sm:text-5xl font-extrabold text-coffee-sand tracking-tight"])}">${ssrInterpolate(unref(t).about.title)}</h2><div class="w-16 h-1 bg-teal-accent mx-auto mt-4 rounded-full"></div></div><div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center"><div class="lg:col-span-4 space-y-10 sm:space-y-14"><!--[-->`);
			ssrRenderList$2(features.value.filter((f) => f.side === "left"), (feature) => {
				_push(`<div class="relative glass-card p-6 sm:p-7 rounded-3xl transition-transform hover:-translate-y-1"><span class="absolute -top-6 left-4 text-6xl sm:text-7xl font-black text-coffee-sand/15 select-none font-mono pointer-events-none">${ssrInterpolate(feature.num)}</span><div class="relative z-10 pt-2"><h3 class="${ssrRenderClass([unref(isKhmer) ? "font-khmer" : "", "text-lg sm:text-xl font-bold text-coffee-sand mb-2.5"])}">${ssrInterpolate(feature.title)}</h3><p class="${ssrRenderClass([unref(isKhmer) ? "font-khmer leading-relaxed" : "", "text-xs sm:text-sm text-coffee-muted leading-relaxed font-normal"])}">${ssrInterpolate(feature.description)}</p></div></div>`);
			});
			_push(`<!--]--></div><div class="lg:col-span-4 flex flex-col items-center justify-center my-4 lg:my-0"><div class="relative w-56 sm:w-72 h-64 sm:h-80 flex items-center justify-center"><div class="absolute w-48 sm:w-60 h-48 sm:h-60 rounded-full bg-teal-accent/15 blur-2xl -z-10"></div><div class="w-full h-full animate-float flex items-center justify-center">`);
			_push(ssrRenderComponent(_component_NuxtImg, {
				src: "/images/cup-hero-brown.svg",
				alt: "Sne Kafe signature cup",
				width: "280",
				height: "320",
				class: "w-full h-auto filter drop-shadow-2xl"
			}, null, _parent));
			_push(`</div></div><button type="button" class="mt-6 px-10 py-3.5 rounded-full bg-teal-accent hover:bg-teal-hover text-teal-darkText font-bold text-sm tracking-wide shadow-glow transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">${ssrInterpolate(unref(t).about.orderBtn)}</button></div><div class="lg:col-span-4 space-y-10 sm:space-y-14"><!--[-->`);
			ssrRenderList$2(features.value.filter((f) => f.side === "right"), (feature) => {
				_push(`<div class="relative glass-card p-6 sm:p-7 rounded-3xl transition-transform hover:-translate-y-1"><span class="absolute -top-6 left-4 text-6xl sm:text-7xl font-black text-coffee-sand/15 select-none font-mono pointer-events-none">${ssrInterpolate(feature.num)}</span><div class="relative z-10 pt-2"><h3 class="${ssrRenderClass([unref(isKhmer) ? "font-khmer" : "", "text-lg sm:text-xl font-bold text-coffee-sand mb-2.5"])}">${ssrInterpolate(feature.title)}</h3><p class="${ssrRenderClass([unref(isKhmer) ? "font-khmer leading-relaxed" : "", "text-xs sm:text-sm text-coffee-muted leading-relaxed font-normal"])}">${ssrInterpolate(feature.description)}</p></div></div>`);
			});
			_push(`<!--]--></div></div></div></section>`);
		};
	}
});
// app/components/AboutSection.vue
var _sfc_setup$4 = AboutSection_vue_vue_type_script_setup_true_lang_default.setup;
AboutSection_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AboutSection.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var AboutSection_default = Object.assign(AboutSection_vue_vue_type_script_setup_true_lang_default, { __name: "AboutSection" });
// app/components/QuizModal.vue?vue&type=script&setup=true&lang.ts
var QuizModal_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "QuizModal",
	__ssrInlineRender: true,
	props: { isOpen: { type: Boolean } },
	emits: ["close"],
	setup(__props, { emit: __emit }) {
		const { products } = useProducts();
		useCartStore();
		const { t, isKhmer} = useI18n();
		const currentStep = ref(0);
		const answers = ref([]);
		const isFinished = ref(false);
		const quizQuestions = computed(() => t.value.quiz.questions);
		const recommendedDrink = computed(() => {
			const votes = {
				cappuccino: 0,
				latte: 0,
				mocha: 0
			};
			answers.value.forEach((answerIndex, questionIndex) => {
				const opt = quizQuestions.value[questionIndex]?.options[answerIndex];
				if (opt?.type) votes[opt.type] = (votes[opt.type] || 0) + 1;
			});
			let highestType = "cappuccino";
			let maxCount = -1;
			for (const key of [
				"cappuccino",
				"latte",
				"mocha"
			]) if (votes[key] > maxCount) {
				maxCount = votes[key];
				highestType = key;
			}
			return products.value.find((p) => p.id === highestType) || products.value[0];
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtImg = _sfc_main$2;
			ssrRenderTeleport(_push, (_push) => {
				if (__props.isOpen) {
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"><div class="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-coffee-sand/30 shadow-2xl animate-scaleIn overflow-hidden"><button type="button" class="absolute top-5 right-5 p-2 rounded-full text-coffee-muted hover:text-white hover:bg-white/10 transition-colors">`);
					_push(ssrRenderComponent(unref(X), { class: "w-5 h-5" }, null, _parent));
					_push(`</button>`);
					if (!isFinished.value) _push(`<div class="mb-6"><div class="flex items-center justify-between text-xs font-semibold text-coffee-sand mb-2"><span class="${ssrRenderClass(unref(isKhmer) ? "font-khmer" : "")}">${ssrInterpolate(unref(t).quiz.qProgress)} ${ssrInterpolate(currentStep.value + 1)} / ${ssrInterpolate(quizQuestions.value.length)}</span><span>${ssrInterpolate(Math.round((currentStep.value + 1) / quizQuestions.value.length * 100))}%</span></div><div class="w-full h-1.5 bg-coffee-dark rounded-full overflow-hidden"><div class="h-full bg-teal-accent transition-all duration-300" style="${ssrRenderStyle({ width: `${(currentStep.value + 1) / quizQuestions.value.length * 100}%` })}"></div></div></div>`);
					else _push(`<!---->`);
					if (!isFinished.value) {
						_push(`<div><h3 class="${ssrRenderClass([unref(isKhmer) ? "font-khmer leading-snug" : "", "text-xl sm:text-2xl font-bold text-coffee-sand mb-5 leading-snug"])}">${ssrInterpolate(quizQuestions.value[currentStep.value].title)}</h3><div class="space-y-3"><!--[-->`);
						ssrRenderList$2(quizQuestions.value[currentStep.value].options, (option, idx) => {
							_push(`<button type="button" class="w-full text-left p-4 rounded-2xl bg-coffee-dark/70 hover:bg-coffee-light/60 border border-coffee-sand/15 hover:border-teal-accent/50 text-coffee-cream text-xs sm:text-sm font-medium transition-all duration-200 hover:translate-x-1 flex items-center justify-between group"><span class="${ssrRenderClass(unref(isKhmer) ? "font-khmer" : "")}">${ssrInterpolate(option.text)}</span><span class="w-5 h-5 rounded-full border border-coffee-sand/30 flex items-center justify-center text-teal-accent group-hover:border-teal-accent group-hover:bg-teal-accent/10 shrink-0 ml-3"><span class="w-2 h-2 rounded-full bg-transparent group-hover:bg-teal-accent transition-colors"></span></span></button>`);
						});
						_push(`<!--]--></div></div>`);
					} else {
						_push(`<div class="text-center py-2 space-y-6"><div class="${ssrRenderClass([unref(isKhmer) ? "font-khmer" : "", "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-accent/15 text-teal-accent text-xs font-bold"])}">`);
						_push(ssrRenderComponent(unref(Sparkles), { class: "w-4 h-4" }, null, _parent));
						_push(`<span>${ssrInterpolate(unref(t).quiz.resultTag)}</span></div><div class="w-36 h-36 mx-auto animate-float">`);
						_push(ssrRenderComponent(_component_NuxtImg, {
							src: recommendedDrink.value.image,
							alt: recommendedDrink.value.name,
							width: "144",
							height: "144",
							class: "w-full h-full object-contain filter drop-shadow-cup"
						}, null, _parent));
						_push(`</div><div><h3 class="${ssrRenderClass([unref(isKhmer) ? "font-khmer" : "", "text-2xl sm:text-3xl font-extrabold text-coffee-sand"])}">${ssrInterpolate(recommendedDrink.value.name)}</h3><p class="${ssrRenderClass([unref(isKhmer) ? "font-khmer" : "", "text-xs sm:text-sm text-coffee-muted mt-2 max-w-sm mx-auto"])}">${ssrInterpolate(recommendedDrink.value.description)}</p><p class="text-lg font-bold text-white mt-2">${ssrInterpolate(recommendedDrink.value.formattedPrice)}</p></div><div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"><button type="button" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-teal-accent hover:bg-teal-hover text-teal-darkText font-bold text-sm tracking-wide shadow-glow transition-all">`);
						_push(ssrRenderComponent(unref(ShoppingBag), { class: "w-4 h-4" }, null, _parent));
						_push(`<span class="${ssrRenderClass(unref(isKhmer) ? "font-khmer" : "")}">${ssrInterpolate(unref(t).quiz.resultBtnOrder)}</span></button><button type="button" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border border-coffee-sand/30 hover:border-coffee-sand text-coffee-sand text-xs font-medium transition-colors">`);
						_push(ssrRenderComponent(unref(RotateCcw), { class: "w-3.5 h-3.5" }, null, _parent));
						_push(`<span class="${ssrRenderClass(unref(isKhmer) ? "font-khmer" : "")}">${ssrInterpolate(unref(t).quiz.resultBtnRestart)}</span></button></div></div>`);
					}
					_push(`</div></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
		};
	}
});
// app/components/QuizModal.vue
var _sfc_setup$3 = QuizModal_vue_vue_type_script_setup_true_lang_default.setup;
QuizModal_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/QuizModal.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var QuizModal_default = Object.assign(QuizModal_vue_vue_type_script_setup_true_lang_default, { __name: "QuizModal" });
// app/components/QuizBanner.vue?vue&type=script&setup=true&lang.ts
var QuizBanner_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "QuizBanner",
	__ssrInlineRender: true,
	setup(__props) {
		const { t, isKhmer } = useI18n();
		const isQuizOpen = ref(false);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtImg = _sfc_main$2;
			const _component_QuizModal = QuizModal_default;
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "promo",
				class: "relative py-16 sm:py-24"
			}, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-8"><div class="relative glass-card rounded-4xl p-8 sm:p-12 lg:p-16 overflow-visible border border-coffee-sand/20 shadow-glass"><div class="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-teal-accent/10 blur-3xl pointer-events-none"></div><div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"><div class="lg:col-span-7 space-y-5 text-center lg:text-left relative z-20"><div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-coffee-dark/80 border border-coffee-sand/20 text-xs font-semibold text-teal-accent">`);
			_push(ssrRenderComponent(unref(Sparkles), { class: "w-3.5 h-3.5" }, null, _parent));
			_push(`<span>${ssrInterpolate(unref(t).quiz.tag)}</span></div><h2 class="${ssrRenderClass([unref(isKhmer) ? "font-khmer leading-snug" : "", "text-2xl sm:text-4xl lg:text-5xl font-extrabold text-coffee-sand tracking-tight leading-tight"])}">${ssrInterpolate(unref(t).quiz.title)}</h2><p class="${ssrRenderClass([unref(isKhmer) ? "font-khmer leading-relaxed" : "", "text-xs sm:text-sm lg:text-base text-coffee-muted max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"])}">${ssrInterpolate(unref(t).quiz.description)}</p><div class="pt-2"><button type="button" class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-teal-accent hover:bg-teal-hover text-teal-darkText font-bold text-sm sm:text-base tracking-wide shadow-glow transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">`);
			_push(ssrRenderComponent(unref(HelpCircle), { class: "w-5 h-5 stroke-[2.2]" }, null, _parent));
			_push(`<span>${ssrInterpolate(unref(t).quiz.btnStart)}</span></button></div></div><div class="lg:col-span-5 relative flex items-center justify-center"><div class="relative lg:absolute lg:-right-14 lg:-top-16 lg:-bottom-16 w-64 sm:w-80 lg:w-[440px] pointer-events-none z-10 transition-transform duration-500 hover:scale-105">`);
			_push(ssrRenderComponent(_component_NuxtImg, {
				src: "/images/coffee-spoon.svg",
				alt: "Wooden spoon loaded with coffee beans",
				width: "440",
				height: "320",
				loading: "lazy",
				class: "w-full h-auto filter drop-shadow-2xl"
			}, null, _parent));
			_push(`</div></div></div></div></div>`);
			_push(ssrRenderComponent(_component_QuizModal, {
				"is-open": isQuizOpen.value,
				onClose: ($event) => isQuizOpen.value = false
			}, null, _parent));
			_push(`</section>`);
		};
	}
});
// app/components/QuizBanner.vue
var _sfc_setup$2 = QuizBanner_vue_vue_type_script_setup_true_lang_default.setup;
QuizBanner_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/QuizBanner.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var QuizBanner_default = Object.assign(QuizBanner_vue_vue_type_script_setup_true_lang_default, { __name: "QuizBanner" });
// app/components/AppFooter.vue?vue&type=script&setup=true&lang.ts
var AppFooter_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AppFooter",
	__ssrInlineRender: true,
	setup(__props) {
		const { t, isKhmer } = useI18n();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<footer${ssrRenderAttrs(mergeProps({
				id: "reviews",
				class: "relative border-t border-coffee-sand/10 bg-coffee-darkest/80 pt-16 pb-12 overflow-hidden"
			}, _attrs))}><div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full bg-coffee-sand/5 blur-3xl pointer-events-none"></div><div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-10"><div class="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-coffee-sand/10"><div class="flex items-center gap-2.5"><div class="w-10 h-10 rounded-full bg-coffee-mid/80 border border-coffee-sand/30 flex items-center justify-center text-teal-accent shadow-md"><svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M4 19h16v2H4v-2zm14-9V5H2v10a4 4 0 004 4h8a4 4 0 004-4v-2h2a3 3 0 003-3v-2a3 3 0 00-3-3h-2zm0 3h2a1 1 0 011 1v2a1 1 0 01-1 1h-2v-4zM4 7h12v8a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"></path></svg></div><div class="flex flex-col"><span class="text-lg font-extrabold text-coffee-sand tracking-wide font-khmer leading-tight"> ស្នេហ៍កាហ្វេ </span><span class="text-[11px] font-semibold tracking-widest uppercase text-teal-accent/90 -mt-0.5"> Sne Kafe </span></div></div><nav class="flex flex-wrap items-center justify-center gap-6 sm:gap-8"><a href="#promo" class="${ssrRenderClass([unref(isKhmer) ? "font-khmer" : "", "text-xs sm:text-sm text-coffee-muted hover:text-coffee-sand underline underline-offset-4 decoration-coffee-sand/30 hover:decoration-teal-accent transition-colors"])}">${ssrInterpolate(unref(t).footer.news)}</a><a href="https://t.me" target="_blank" rel="noopener noreferrer" class="${ssrRenderClass([unref(isKhmer) ? "font-khmer" : "", "text-xs sm:text-sm text-coffee-muted hover:text-coffee-sand underline underline-offset-4 decoration-coffee-sand/30 hover:decoration-teal-accent transition-colors"])}">${ssrInterpolate(unref(t).footer.telegram)}</a><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="${ssrRenderClass([unref(isKhmer) ? "font-khmer" : "", "text-xs sm:text-sm text-coffee-muted hover:text-coffee-sand underline underline-offset-4 decoration-coffee-sand/30 hover:decoration-teal-accent transition-colors"])}">${ssrInterpolate(unref(t).footer.instagram)}</a><a href="#hero" class="${ssrRenderClass([unref(isKhmer) ? "font-khmer" : "", "text-xs sm:text-sm text-coffee-muted hover:text-coffee-sand underline underline-offset-4 decoration-coffee-sand/30 hover:decoration-teal-accent transition-colors"])}">${ssrInterpolate(unref(t).footer.loyalty)}</a></nav><button type="button" class="p-3 rounded-full glass-card hover:border-teal-accent/50 text-coffee-sand hover:text-teal-accent transition-all duration-200 active:scale-95" aria-label="Back to top">`);
			_push(ssrRenderComponent(unref(ArrowUp), { class: "w-4 h-4" }, null, _parent));
			_push(`</button></div><div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-coffee-subtle"><p class="${ssrRenderClass(unref(isKhmer) ? "font-khmer" : "")}">${ssrInterpolate(unref(t).footer.copyright)}</p><p class="${ssrRenderClass(unref(isKhmer) ? "font-khmer" : "")}">${ssrInterpolate(unref(t).footer.hours)}</p></div></div></footer>`);
		};
	}
});
// app/components/AppFooter.vue
var _sfc_setup$1 = AppFooter_vue_vue_type_script_setup_true_lang_default.setup;
AppFooter_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppFooter.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var AppFooter_default = Object.assign(AppFooter_vue_vue_type_script_setup_true_lang_default, { __name: "AppFooter" });
// app/pages/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const { locale, isKhmer, t } = useI18n();
		useHead(() => ({
			htmlAttrs: { lang: locale.value },
			title: isKhmer.value ? "ស្នេហ៍កាហ្វេ (Sne Kafe) — ស្វែងយល់ពីរសជាតិដ៏អស្ចារ្យក្នុងគ្រប់ដំណក់!" : "Sne Kafe (ស្នេហ៍កាហ្វេ) — Exceptional Coffee in Every Sip!"
		}));
		useSeoMeta({
			title: () => isKhmer.value ? "ស្នេហ៍កាហ្វេ (Sne Kafe) — ហាងកាហ្វេសិល្បៈពិសេស" : "Sne Kafe (ស្នេហ៍កាហ្វេ) — Artisan Coffee Landing",
			ogTitle: () => isKhmer.value ? "ស្នេហ៍កាហ្វេ (Sne Kafe) — ហាងកាហ្វេសិល្បៈពិសេស" : "Sne Kafe (ស្នេហ៍កាហ្វេ) — Artisan Coffee Landing",
			description: () => t.value.hero.description,
			ogDescription: () => t.value.hero.description
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_AppHeader = AppHeader_default;
			const _component_HeroSection = HeroSection_default;
			const _component_ProductList = ProductList_default;
			const _component_AboutSection = AboutSection_default;
			const _component_QuizBanner = QuizBanner_default;
			const _component_AppFooter = AppFooter_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["relative overflow-x-hidden", unref(isKhmer) ? "font-khmer" : "font-sans"] }, _attrs))}>`);
			_push(ssrRenderComponent(_component_AppHeader, null, null, _parent));
			_push(`<main>`);
			_push(ssrRenderComponent(_component_HeroSection, null, null, _parent));
			_push(ssrRenderComponent(_component_ProductList, null, null, _parent));
			_push(ssrRenderComponent(_component_AboutSection, null, null, _parent));
			_push(ssrRenderComponent(_component_QuizBanner, null, null, _parent));
			_push(`</main>`);
			_push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
			_push(`</div>`);
		};
	}
});
// app/pages/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var pages_default = index_vue_vue_type_script_setup_true_lang_default;

export { pages_default as default };
//# sourceMappingURL=pages-DlBge2ID.mjs.map
