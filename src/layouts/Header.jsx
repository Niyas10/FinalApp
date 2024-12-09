"use client";

import React, { useState } from "react";
import { Text, ButtonGroup, Popover, ActionList, Icon } from "@shopify/polaris";
import { CaretDownIcon } from "@shopify/polaris-icons";
import styles from "../styles/main.module.css";
import "./../styles/globals.css";

function Header() {
  const [popoverActive, setPopoverActive] = useState(false);

  const options = [
    { content: "Option A", onAction: () => console.log("Export clicked") },
    { content: "Option B", onAction: () => console.log("Import clicked") },
  ];

  const togglePopover = () => setPopoverActive((active) => !active);
  const closePopover = () => setPopoverActive(false);

  const menuSection = (
    <ButtonGroup>
      <div className={styles.navRight}>
        <p className={styles.navtext} onClick={() => console.log("Export")}>
          Export
        </p>
        <p className={styles.navtext} onClick={() => console.log("Import")}>
          Import
        </p>
        <Popover
          active={popoverActive}
          activator={
            <p className={styles.navtext} onClick={togglePopover}>
              More Options <Icon source={CaretDownIcon} />
            </p>
          }
          onClose={closePopover}
          preferredAlignment="bottom"
        >
          <ActionList items={options} />
        </Popover>
        <button
          className={styles.navButton}
          onClick={() => console.log("Add Product")}
        >
          Add Product
        </button>
      </div>
    </ButtonGroup>
  );

  return (
    <section className="header-padding ">
      <div className="containers" style={{ paddingTop: "50px" }}>
        <div className={styles.navSection}>
          <div className={styles.NavbarMainText}>
            <Text>Products</Text>
          </div>
          <div className={styles.navMenu}>{menuSection}</div>
        </div>
      </div>
    </section>
  );
}

export default Header;
