import { PRODUCTS } from "../DummyList";
import Product from "./Product";
import Shop from "./Shop.js.bakk";
import { useState, useEffect } from "react";
//import soonToExpireAPI from "../api/soonToExpireAPI.js";
import CurrentDateTime from "./CurrentDateTime";
import SearchItem from "./SearchItem";
import Button2 from "./Button";

function ProductList_NEW() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]); //used for rendering only
  const [searchItem, setSearchItem] = useState("");
  const [expiryMonth, setExpiryMonth] = useState(false); //used this state to track if user clicked on the expiry month
  const [todayDate, setTodayDate] = useState("");
  const [soonToExpireItems, setSoonToExpireItems] = useState([]); //used for sharing the value around
  const [expiryButton, setExpiryButton] = useState(true);

  const getAllProducts = async () => {
    try {
      //const response = await soonToExpireAPI.get("/products");
      const response = await PRODUCTS.get("/products");
      console.log("my products is")
      console.log(response.data);
      setProducts(response.data);

      //used the parse method to convert it to number
      console.log("GET all products completed2!");
    } catch (error) {
      console.log("❌ Get all products error: " + error.message);
    }
  };

  useEffect(() => {
    console.log("Effect running");
    getAllProducts();
  }, []);

  const handleSearchItem = (value) => {
    setSearchItem(value);
    const myProductList = [...products];
    setIsLoading(true);
    if (products.length >= 1) {
      console.log("Typing:", value);
      const searchResult = myProductList.filter(
        (item) => item.item.toLowerCase() === value.toLowerCase()
      );
      setFilteredItems(searchResult);
      console.log("search result:", searchResult);
    } else {
      console.log("products is empty");
    }
  };

  const handleCategoryAll = () => {
    const myProductList = [...products]; //copy the products from useState into our local variable due to the async nature.
    if (products.length >= 1) {
      setFilteredItems(myProductList);
      console.log("All Items:", myProductList);
    } else {
      console.log("products is empty");
    }
  };

  const handleCategoryFruit = () => {
    let myProductList = [];
    console.log("is expiry button clicked:", expiryMonth);
    expiryMonth
      ? (myProductList = [...soonToExpireItems])
      : (myProductList = [...products]);

    if (products.length >= 1) {
      const fruits = myProductList.filter((item) => item.category === "fruit"); // Filter items based on the selected category
      setFilteredItems(fruits);
      console.log("Fruits", fruits);
      if (fruits.length === 0) {
        console.log("No Fruits found!");
      }
    } else {
      console.log("products is empty");
    }
  };

  const handleCategoryMeat = () => {
    let myProductList = [];
    console.log("is expiry button clicked:", expiryMonth);
    expiryMonth
      ? (myProductList = [...soonToExpireItems])
      : (myProductList = [...products]);

    if (products.length >= 1) {
      const meats = myProductList.filter((item) => item.category === "meat");
      setFilteredItems(meats);
      console.log("Meats", meats);
      if (meats.length === 0) {
        console.log("No Meats found!");
      }
    } else {
      console.log("products is empty");
    }
  };

  const handleCategoryVegetable = () => {
    let myProductList = [];
    console.log("is expiry button clicked:", expiryMonth);
    expiryMonth
      ? (myProductList = [...soonToExpireItems])
      : (myProductList = [...products]);

    if (myProductList.length >= 1) {
      const vegetables = myProductList.filter(
        (item) => item.category === "vegetable"
      );
      setFilteredItems(vegetables);
      console.log("Vegetables", vegetables);
      if (vegetables.length === 0) {
        console.log("No Vegetables found!");
      }
    } else {
      console.log("products is empty");
    }
  };

  const handleCategoryOthers = () => {
    let myProductList = [];
    console.log("is expiry button clicked:", expiryMonth);
    expiryMonth
      ? (myProductList = [...soonToExpireItems])
      : (myProductList = [...products]);

    if (products.length >= 1) {
      const others = myProductList.filter((item) => item.category === "others");
      setFilteredItems(others);
      console.log("Others", others);
      if (others.length === 0) {
        console.log("No Others type found!");
      }
    } else {
      console.log("products is empty");
    }
  };

  // Define a function to receive data from the child
  //this is used for calculating the expiry date based on today date
  const receiveDataFromChild = (data) => {
    setTodayDate(data);
  };

  const handleExpiry30Days = () => {
    const myProductList = [...products];
    const oneMonth = 2592000000;
    const soonToExpireItems = [];

    if (products.length >= 1) {
      setExpiryMonth(true);
      //if we you map methodm it'll requires a uuid which is from the api...
      //const expireIn30days = myProductList.map((item) => ((Date.parse(item.expiryDate) - todayDate) <= 9999999999));
      for (let i = 0; i < myProductList.length - 1; i++) {
        if (Date.parse(myProductList[i].expiryDate) - todayDate <= oneMonth) {
          soonToExpireItems.push(myProductList[i]);
        }
        setSoonToExpireItems(soonToExpireItems); //to store the items in state so it can be pass around
        setFilteredItems(soonToExpireItems); //for rendering the display of items expiry = 30days
      }
      console.log("1 month expiry:", soonToExpireItems);
      console.log("is expiry button clicked?", expiryMonth);
    } else {
      console.log("products list is empty");
    }
  };

  const handleExpiry60Days = () => {
    const myProductList = [...products];
    const oneMonth = 2592000000;
    const twoMonth = 5184000000;
    const soonToExpireItems = [];

    if (products.length >= 1) {
      for (let i = 0; i < myProductList.length - 1; i++) {
        if (
          Date.parse(myProductList[i].expiryDate) - todayDate >= oneMonth &&
          Date.parse(myProductList[i].expiryDate) - todayDate <= twoMonth
        ) {
          soonToExpireItems.push(myProductList[i]);
        }
        setSoonToExpireItems(soonToExpireItems); //to store the items in state so it can be pass around
        setFilteredItems(soonToExpireItems); //for rendering the display of items expiry = 30days
      }
      console.log(soonToExpireItems);
    } else {
      console.log("products list is empty");
    }
  };

  const handleExpiry90Days = () => {
    const myProductList = [...products];
    const twoMonth = 5184000000;
    const threeMonth = 7776000000;
    const soonToExpireItems = [];

    if (products.length >= 1) {
      for (let i = 0; i < myProductList.length - 1; i++) {
        if (
          Date.parse(myProductList[i].expiryDate) - todayDate >= twoMonth &&
          Date.parse(myProductList[i].expiryDate) - todayDate <= threeMonth
        ) {
          soonToExpireItems.push(myProductList[i]);
        }
        setSoonToExpireItems(soonToExpireItems); //to store the items in state so it can be pass around
        setFilteredItems(soonToExpireItems); //for rendering the display of items expiry = 30days
      }
      console.log(soonToExpireItems);
    } else {
      console.log("products list is empty");
    }
  };

  return (
    <div className="shop">
      <div className="shopTitle">
        <h1>Food Waste Reducer App</h1>
      </div>

      <Shop
        products={products}
        filteredItems={filteredItems}
        setSearchItem={searchItem}
        expiryMonth={expiryMonth}
        todayDate={todayDate}
        soonToExpireItems={soonToExpireItems}
      />

      {console.log("Child data from CurrentDateTime:", todayDate)}
      <CurrentDateTime sendDataToParent={receiveDataFromChild} />

      <div className="mySearchandFilter">
        <SearchItem onChange={handleSearchItem} />
        <br />
        <div className="expireDate">
          <Button2
            label="Expired in 1 months"
            onClick={() => handleExpiry30Days()}
          />
          <Button2
            label="Expired in 2 months"
            onClick={() => handleExpiry60Days()}
          />
          <Button2
            label="Expired in 3 months"
            onClick={() => handleExpiry90Days()}
          />
        </div>
        <br />
        <Button2 label="All items" onClick={() => handleCategoryAll()} />
        <Button2 label="Fruits" onClick={() => handleCategoryFruit()}></Button2>
        <Button2 label="Meats" onClick={() => handleCategoryMeat()} />
        <Button2 label="Vegetables" onClick={() => handleCategoryVegetable()} />
        <Button2 label="Others" onClick={() => handleCategoryOthers()} />
      </div>

      <div className="products">
        {filteredItems.map((filteredItems) => (
          <Product data={filteredItems} key={filteredItems.id} />
        ))}
      </div>
    </div>
  );
}

export default ProductList_NEW;
