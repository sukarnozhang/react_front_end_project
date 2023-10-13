// Shop.js

import axios from 'axios';
import { useState, useEffect } from "react";

//import { PRODUCTS }  from "../DummyList";
//import { ProductList }  from "../components/ProductList";
//import ProductList from './ProductList'
import styles from "../allCssStyling/Shop.modules.css";
import ShopContextProvider from "../context/shopcontext";

import Product from "./Product";
import soonToExpireAPI from "../api/soonToExpireAPI.js";
import CurrentDateTime from "./CurrentDateTime";
import SearchItem from "./SearchItem";
import Button2 from "./Button";
import { NavLink } from "react-router-dom";
import { FaAppleAlt, FaCarrot, FaInfinity } from "react-icons/fa";
import { GiRoastChicken } from "react-icons/gi";

function Shop() {
  //const currentDate = new Date();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]); //used for rendering only
  const [searchItem, setSearchItem] = useState(""); 
  const [expiryMonth, setExpiryMonth] = useState(false); //used this state to track if user clicked on the expiry month
  const [todayDate, setTodayDate] = useState("");
  const [soonToExpireItems, setSoonToExpireItems] = useState([]); //used for sharing the value around
  const [expiryButton, setExpiryButton] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const oneMonth = 2592000000;
  const twoMonth = 5184000000;
  const threeMonth = 7776000000;

  const getAllProducts = async () => {
    try {
      const response = await soonToExpireAPI.get("/products");
      console.log(response.data);
      setProducts(response.data);

      //console.log("Expiry date format:", typeof response.data[0].expiryDate);     //used the parse method to convert it to number
      console.log("GET all products completed!");
    } catch (error) {
      console.log("❌ Get all products error: " + error.message);
    }
  };

  useEffect(() => {
    console.log("Effect running");
    getAllProducts();
  }, []);

  const handleSearchItem = (value) => {
    const appId = process.env.REACT_APP_RECEIPE_APP_ID;
    const appKey = process.env.REACT_APP_RECEIPE_APP_KEY;
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

    const endpoint = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchItem}&app_id=${appId}&app_key=${appKey}`;
    axios.get(endpoint)
        .then(response => {
            const recipes = response.data.hits.map(hit => hit.recipe);
            setRecipes(recipes);
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
        }); 
        console.log('my returned recipes:', recipes);      
  };

  const handleCategoryAll = () => {
    const myProductList = [...products]; //copy the products from useState into our local variable due to the async nature. Scare it will be empty

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
      // setFilteredItems(fruits);
      // console.log("Fruits:", fruits);
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
      // setFilteredItems(meats);
      // console.log("Meats:", meats);
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
    const soonToExpireItems = [];

    //if(expiryMonth===true) {setExpiryButton(false);}
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
    const soonToExpireItems = [];

    if (products.length >= 1) {
      for (let i = 0; i < myProductList.length - 1; i++) {
        if (
          Date.parse(myProductList[i].expiryDate) - todayDate > oneMonth &&
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
    const soonToExpireItems = [];

    if (products.length >= 1) {
      for (let i = 0; i < myProductList.length - 1; i++) {
        if (
          Date.parse(myProductList[i].expiryDate) - todayDate > twoMonth &&
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

      {/* weicong - added the SearchItem & <button> tag */}
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
          <Product data={filteredItems} key={filteredItems.id} /> //weicong - Add the id to the key for every items in the list. This is a React requirement
        ))}
      </div>

      <div>           
        {recipes.length >= 1 ? <h1 style={{textAlign: 'center'}}>Recipes Available</h1> : null}
          {handleSearchItem}           
        <ul>
            {recipes.map((recipe, index) => (
                <li key={index}>{recipe.label}<br /><a href={recipe.url} target="_blank" rel="noreferrer"><img src={recipe.images.REGULAR.url} /></a></li>
            ))}                
        </ul>            
      </div>
      {/* <ShopContextProvider filteredItems={filteredItems} products={products}/> */}
    </div>
  );
}

export default Shop;
