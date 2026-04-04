"use client";

import "./style.scss";
import { useContext, useRef, useState, useMemo, useEffect } from "react";
import { CartContext } from "@/cart/add/cart";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import Link from "next/link";
import { moscowCities } from "./city.js";

const moscowCitiesSet = new Set(
  moscowCities.map((city) => city.toLowerCase().trim()),
);

const cityNames = {
  msk: "Москва",
  moscow: "Москва",
  spb: "Санкт-Петербург",
  ekb: "Екатеринбург",
  kazan: "Казань",
  nn: "Нижний Новгород",
  chelyabinsk: "Челябинск",
  samara: "Самара",
  omsk: "Омск",
  rostov: "Ростов-на-Дону",
  ufa: "Уфа",
  krasnoyarsk: "Красноярск",
  perm: "Пермь",
  voronezh: "Воронеж",
  volgograd: "Волгоград",
  krasnodar: "Краснодар",
  novosibirsk: "Новосибирск",
  nsk: "Новосибирск",
  khabarovsk: "Хабаровск",
  vladivostok: "Владивосток",
  irkutsk: "Иркутск",
  kemerovo: "Кемерово",
  kaliningrad: "Калининград",
  dnr: "Донецк",
  donetsk: "Донецк",
  krym: "Крым",
};

const CheckoutPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("delivery");
  const [loading, setLoading] = useState(false);
  const [allowPickup, setAllowPickup] = useState(false);

  const [honeypot, setHoneypot] = useState("");
  const [formLoadedAt] = useState(() => Date.now());
  const [mouseMovements, setMouseMovements] = useState(0);

  const { cartItems, clearCart, calculateTotalPrice } = useContext(CartContext);
  const totalPrice = useMemo(
    () => calculateTotalPrice(),
    [cartItems, calculateTotalPrice],
  );
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    lastName: "",
    phoneNumber: "",
    telegram: "",
    city: "",
    streetAddress: "",
    comment: "",
    // Поле privacyConsent удалено
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const hostname = window.location.hostname.toLowerCase();
    const subdomain = hostname.split(".")[0];
    const isMoscowDomain =
      subdomain === "msk" ||
      subdomain === "moscow" ||
      hostname === "iqossticks.ru";
    setAllowPickup(isMoscowDomain);
    if (!isMoscowDomain) setSelectedMethod("delivery");
  }, []);

  const totalQuantityPacks = cartItems
    .filter((i) => i.type === "Пачка")
    .reduce((acc, i) => acc + i.quantity, 0);
  const hasBlock = cartItems.some((i) => i.type === "Блок");
  const isMinOrderMet = hasBlock || totalQuantityPacks >= 10;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.lastName.trim()) newErrors.lastName = "Введите имя";
    if (
      !formData.phoneNumber ||
      formData.phoneNumber.replace(/\D/g, "").length < 11
    )
      newErrors.phoneNumber = "Некорректный телефон";

    // Проверка privacyConsent удалена

    if (selectedMethod === "delivery") {
      if (!formData.city.trim()) newErrors.city = "Укажите город";
      if (!formData.streetAddress.trim())
        newErrors.streetAddress = "Укажите адрес";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const solveChallenge = async () => {
    try {
      const res = await fetch("/api/challenge");
      const { id, salt, difficulty } = await res.json();
      const prefix = "0".repeat(difficulty);
      const encoder = new TextEncoder();
      for (let nonce = 0; nonce < 1_000_000; nonce++) {
        const data = encoder.encode(salt + ":" + nonce);
        const hashBuf = await crypto.subtle.digest("SHA-256", data);
        const hashHex = Array.from(new Uint8Array(hashBuf))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        if (hashHex.startsWith(prefix)) return { challengeId: id, nonce };
      }
    } catch (e) {
      return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !validateForm()) return;

    if (honeypot || Date.now() - formLoadedAt < 3000 || mouseMovements < 3)
      return;

    setLoading(true);

    const pow = await solveChallenge();
    if (!pow) {
      alert("Ошибка безопасности. Обновите страницу.");
      setLoading(false);
      return;
    }

    const hostname = window.location.hostname.toLowerCase();
    const subdomain = hostname.split(".")[0];
    const siteName = `iqossticks.ru (${cityNames[subdomain] || "Основной"})`;

    const isMoscowCity = moscowCitiesSet.has(
      formData.city.toLowerCase().trim(),
    );
    const phoneNorm = formData.phoneNumber.replace(/\D/g, "");
    const telegramUsername = formData.telegram.trim()
      ? formData.telegram.startsWith("@")
        ? formData.telegram
        : `@${formData.telegram}`
      : "не указан";

    const formattedCart = cartItems
      .map((i) => `- ${i.name} (${i.type}) x${i.quantity}: ${i.price} ₽`)
      .join("\n");

    let waMessage = "";
    if (selectedMethod === "pickup") {
      waMessage = `Добрый день! Получили ваш заказ с сайта ${siteName} ✅\n\nНаш адрес для самовывоза:\nг. Москва, ул. Римского-Корсакова 11к8 (пункт OZON).\n\nОплата наличными ❗️\nНужно заранее согласовать время приезда.`;
    } else if (isMoscowCity) {
      waMessage = `Здравствуйте! Получили ваш заказ с сайта ${siteName} ✅\n\nДоставку делаем через Яндекс/Достависту. Оплата — перевод на карту.\n\nКогда вам удобно принять заказ? 😊`;
    } else {
      waMessage = `Здравствуйте! Получили заказ с сайта ${siteName} ✅\n\nВ регионы отправляем через СДЭК после оплаты. Наложенным платежом не работаем ❌.\n\nНужны данные: ФИО, Город и адрес ПВЗ СДЭК.`;
    }

    const waFull = `${waMessage}\n\n📦 КОРЗИНА:\n${formattedCart}\n\n💰 Сумма: ${totalPrice} ₽`;

    const orderData = {
      customer_name: formData.lastName.trim(),
      phone_number: `+${phoneNorm}`,
      is_delivery: selectedMethod === "delivery" ? 1 : 0,
      city: formData.city.trim() || "Москва",
      address:
        formData.streetAddress.trim() ||
        (selectedMethod === "delivery" ? "Доставка" : "Самовывоз"),
      total_amount: Number(totalPrice),
      telegram_username: telegramUsername,
      comment: formData.comment.trim(),
      ordered_items: cartItems.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        type: i.type,
      })),
      _pow: pow,
      website: siteName,
    };

    try {
      await Promise.allSettled([
        fetch("/api/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: waFull }),
        }),
        fetch(
          `https://api.green-api.com/waInstance1103290542/SendMessage/65dee4a31f1342768913a5557afc548591af648dffc44259a6`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: `${phoneNorm}@c.us`,
              message: waFull,
            }),
          },
        ),
      ]);

      const dbRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (dbRes.ok) {
        alert("✅ Заказ успешно оформлен! Менеджер свяжется с вами.");
        clearCart();
        window.location.href = "/";
      }
    } catch (error) {
      alert("Ошибка при отправке. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="checkout-page"
      onMouseMove={() => setMouseMovements((c) => c + 1)}
    >
      <div className="checkout-form">
        <div className="plitka">
          <h1>Оформление заказа</h1>
          <h5>Укажите телефон с WhatsApp или ник Telegram для связи.</h5>
        </div>

        <form onSubmit={handleSubmit} ref={formRef}>
          <input
            type="text"
            className="h-pot"
            style={{ display: "none" }}
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex="-1"
          />

          <div className="checkout-name">
            <h4>Контактные данные</h4>
            <input
              type="text"
              name="lastName"
              placeholder="Ваше имя *"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            {errors.lastName && <p className="error-msg">{errors.lastName}</p>}

            <input
              type="text"
              name="telegram"
              placeholder="Telegram username"
              value={formData.telegram}
              onChange={handleInputChange}
            />

            <input
              type="text"
              name="city"
              placeholder="Город *"
              value={formData.city}
              onChange={handleInputChange}
            />
            {errors.city && <p className="error-msg">{errors.city}</p>}

            <input
              type="text"
              name="streetAddress"
              placeholder="Улица, дом, квартира *"
              value={formData.streetAddress}
              onChange={handleInputChange}
            />
            {errors.streetAddress && (
              <p className="error-msg">{errors.streetAddress}</p>
            )}

            <PhoneInput
              country={"ru"}
              value={formData.phoneNumber}
              onChange={(val) =>
                setFormData((p) => ({ ...p, phoneNumber: val }))
              }
              onlyCountries={["ru"]}
              placeholder="Введите номер телефона *"
            />
            {errors.phoneNumber && (
              <p className="error-msg">{errors.phoneNumber}</p>
            )}
          </div>
        </form>
      </div>

      <div className="checkout-table">
        <h4>Корзина</h4>
        <ul className="cart-list">
          {cartItems.map((item) => (
            <li key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-img" />
              <div className="item-info">
                <p>
                  {item.name} ({item.type})
                </p>
                <span>
                  {item.quantity} шт. x {item.price} ₽
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="total-box">
          <p>
            Итого: <strong>{totalPrice} ₽</strong>
          </p>
        </div>

        {/* Блок privacy-check удален */}

        <button
          className="submit-btn"
          onClick={() => formRef.current.requestSubmit()}
          disabled={loading}
        >
          {loading ? "Обработка..." : "Заказать"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
