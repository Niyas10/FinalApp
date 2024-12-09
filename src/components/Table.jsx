"use client";

import React, { useState, useEffect } from "react";
import {
  LegacyCard,
  LegacyTabs,
  LegacyFilters,
  Badge,
  IndexTable,
  Text,
  ChoiceList,
  Pagination,
  Spinner,
  Modal,
  Button,
} from "@shopify/polaris";
import styles from "../styles/main.module.css";

const Table = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [queryValue, setQueryValue] = useState(undefined);
  const [availability, setAvailability] = useState(undefined);
  const [productType, setProductType] = useState(undefined);
  const [vendor, setVendor] = useState(undefined);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const [apiProducts, localProducts] = await Promise.all([
          fetch("https://fakestoreapi.com/products").then((res) => res.json()),
          fetch("/api/product.json").then((res) => res.json()),
        ]);

        const combinedProducts = apiProducts.map((product) => {
          const extraInfo =
            localProducts.find((item) => item.id === product.id) || {};
          return {
            id: product.id,
            title: product.title,
            image: product.image,
            status: extraInfo.status || "Active",
            inventory: extraInfo.inventory || "",
            type: extraInfo.type || "",
            vendor: extraInfo.vendor || "Unknown",
            availability: extraInfo.availability || "Online Store",
            description: product.description,
            rating: {
              rate: product.rating.rate,
              count: product.rating.count,
            },
          };
        });

        setProducts(combinedProducts);
        setFilteredProducts(combinedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showModal]);

  const getFilteredProducts = () => {
    let filtered = [...products];

    if (selectedTab === 1) {
      filtered = filtered.filter((product) => product.status === "Active");
    } else if (selectedTab === 2) {
      filtered = filtered.filter((product) => product.status === "Draft");
    } else if (selectedTab === 3) {
      filtered = filtered.filter((product) => product.status === "Archived");
    }

    if (availability && availability.length > 0) {
      filtered = filtered.filter((product) =>
        availability.includes(product.availability)
      );
    }

    if (productType && productType.length > 0) {
      filtered = filtered.filter((product) =>
        productType.includes(product.type)
      );
    }

    if (vendor && vendor.length > 0) {
      filtered = filtered.filter((product) => vendor.includes(product.vendor));
    }

    if (queryValue) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(queryValue.toLowerCase())
      );
    }

    return filtered;
  };

  const paginatedProducts = () => {
    const filtered = getFilteredProducts();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleTabChange = (selectedTabIndex) => {
    setSelectedTab(selectedTabIndex);
    setCurrentPage(1);
  };

  const handleQueryChange = (value) => {
    setQueryValue(value);
    setCurrentPage(1);
  };

  const handleAvailabilityChange = (value) => {
    setAvailability(value);
    setCurrentPage(1);
  };

  const handleProductTypeChange = (value) => {
    setProductType(value);
    setCurrentPage(1);
  };

  const handleVendorChange = (value) => {
    setVendor(value);
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setQueryValue(undefined);
    setAvailability(undefined);
    setProductType(undefined);
    setVendor(undefined);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(getFilteredProducts().length / itemsPerPage);
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  // Prepare row markup
  const rowMarkup = paginatedProducts().map((product, index) => (
    <IndexTable.Row
      key={product.id}
      id={product.id.toString()}
      position={index}
      onClick={() => handleOpenModal(product)}
      style={{ cursor: "pointer" }}
    >
      <IndexTable.Cell>
        <img
          src={product.image}
          alt={product.title}
          style={{ width: "50px", height: "50px", objectFit: "contain" }}
        />
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text fontWeight="bold" as="span">
          {product.title.slice(0, 20)}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone="success">{product.status}</Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <span
          style={{
            color: product.inventory < 0 ? "red" : "inherit",
            padding: "5px",
          }}
        >
          {product.inventory}
        </span>
      </IndexTable.Cell>
      <IndexTable.Cell>{product.type}</IndexTable.Cell>
      <IndexTable.Cell>{product.vendor}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  // Filters configuration
  const filters = [
    {
      key: "availability",
      label: "Purchase Availability",
      filter: (
        <ChoiceList
          title="Availability"
          titleHidden
          choices={[
            { label: "Online Store", value: "Online Store" },
            { label: "Point of Sale", value: "Point of Sale" },
            { label: "Buy Button", value: "Buy Button" },
          ]}
          selected={availability || []}
          onChange={handleAvailabilityChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "productType",
      label: "Product Type",
      filter: (
        <ChoiceList
          title="Product Type"
          titleHidden
          choices={[
            { label: "T-Shirt", value: "T-Shirt" },
            { label: "Accessory", value: "Accessory" },
            { label: "Gift Card", value: "Gift Card" },
          ]}
          selected={productType || []}
          onChange={handleProductTypeChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "vendor",
      label: "More Filters",
      filter: (
        <ChoiceList
          title="Vendor"
          titleHidden
          choices={[
            { label: "Company 123", value: "Company 123" },
            { label: "Boring Rock", value: "Boring Rock" },
            { label: "Rustic LTD", value: "Rustic LTD" },
          ]}
          selected={vendor || []}
          onChange={handleVendorChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
  ];

  const noProductsFoundMarkup = (
    <div className={styles.notFound}>
      <Text>No products found</Text>
      <Text>Try changing the filters or search term</Text>
    </div>
  );

  return (
    <>
      <section className="containers" style={{ paddingTop: "50px" }}>
        <div>
          <LegacyCard>
            <LegacyTabs
              tabs={[
                { id: "all-products", content: "All" },
                { id: "active-products", content: "Active" },
                { id: "draft-products", content: "Draft" },
                { id: "archived-products", content: "Archived" },
              ]}
              selected={selectedTab}
              onSelect={handleTabChange}
            >
              <LegacyCard.Section>
                <LegacyFilters
                  queryValue={queryValue}
                  filters={filters}
                  appliedFilters={[]}
                  onQueryChange={handleQueryChange}
                  onQueryClear={() => setQueryValue(undefined)}
                  onClearAll={handleClearAll}
                  queryPlaceholder="Search products..."
                />
              </LegacyCard.Section>
            </LegacyTabs>

            {loading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                }}
              >
                <Spinner size="large" />
                <Text>Loading products...</Text>
              </div>
            ) : getFilteredProducts().length === 0 ? (
              noProductsFoundMarkup
            ) : (
              <LegacyCard.Section>
                <IndexTable
                  resourceName={{ singular: "product", plural: "products" }}
                  itemCount={getFilteredProducts().length}
                  headings={[
                    { title: "" },
                    { title: "Product" },
                    { title: "Status" },
                    { title: "Inventory" },
                    { title: "Type" },
                    { title: "Vendor" },
                  ]}
                  selectable={false}
                >
                  {rowMarkup}
                </IndexTable>
              </LegacyCard.Section>
            )}
          </LegacyCard>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Pagination
              hasPrevious={currentPage > 1}
              onPrevious={handlePreviousPage}
              hasNext={
                currentPage <
                Math.ceil(getFilteredProducts().length / itemsPerPage)
              }
              onNext={handleNextPage}
            />
          </div>
        </div>
      </section>

      {selectedProduct && (
        <Modal
          open={showModal}
          onClose={handleCloseModal}
          title={selectedProduct.title}
        >
          <div style={{ padding: "1rem", overflowY: "auto" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                style={{
                  maxWidth: "350px",
                  maxHeight: "350px",
                  objectFit: "contain",
                  paddingBottom: "8px",
                }}
              />
              <Text
                as="p"
                variant="bodyMd"
                style={{
                  borderBottom: "2px solid black",
                  paddingBottom: "8px",
                }}
                className="description"
              >
                <strong style={{ fontSize: "28px", marginBottom: "200px" }}>
                  Description:
                </strong>
                <br />
                <br />
                {selectedProduct.description}
              </Text>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
                marginTop: "1rem",
                paddingBottom: "8px",
              }}
            >
              <div>
                <Text as="p" variant="bodyMd">
                  <strong style={{ fontSize: "28px", marginBottom: "200px" }}>
                    Rating:
                  </strong>
                  <br /> <br />
                  Rating:
                  <strong
                    style={{
                      fontSize: "14px",
                      marginBottom: "200px",
                      fontWeight: 400,
                    }}
                  >
                    {selectedProduct.rating.rate}/5
                  </strong>
                </Text>
                <Text as="p" variant="bodyMd">
                  <strong style={{ fontSize: "14px", marginBottom: "200px" }}>
                    Total Reviews:{" "}
                    <strong
                      style={{
                        fontSize: "14px",
                        marginBottom: "200px",
                        fontWeight: 400,
                      }}
                    >
                      {selectedProduct.rating.count}+ customers
                    </strong>{" "}
                  </strong>
                </Text>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Table;
