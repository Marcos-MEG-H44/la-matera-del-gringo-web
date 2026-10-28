import React, { useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import DashboardHome from "../components/admin/DashboardHome";
import ProductsManager from "../components/admin/ProductsManager";
import CategoriesManager from "../components/admin/CategoriesManager";
import ImageManager from "../components/admin/ImageManager";
import FeaturedManager from "../components/admin/FeaturedManager";
import DiscountsManager from "../components/admin/DiscountsManager";
import PromoCalendar from "../components/admin/PromoCalendar";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  const handleOpenNewProduct = () => {
    setActiveTab("productos");
    setIsNewProductModalOpen(true);
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "inicio" && (
        <DashboardHome
          setActiveTab={setActiveTab}
          onOpenNewProductModal={handleOpenNewProduct}
        />
      )}
      {activeTab === "productos" && (
        <ProductsManager
          isNewModalOpen={isNewProductModalOpen}
          setIsNewModalOpen={setIsNewProductModalOpen}
        />
      )}
      {activeTab === "categorias" && <CategoriesManager />}
      {activeTab === "imagenes" && <ImageManager />}
      {activeTab === "destacados" && <FeaturedManager />}
      {activeTab === "descuentos" && <DiscountsManager />}
      {activeTab === "calendario" && <PromoCalendar />}
    </AdminLayout>
  );
}
