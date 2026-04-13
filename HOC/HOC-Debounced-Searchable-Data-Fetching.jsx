import React, { useState, useEffect } from "react";

// --------------------
// Debounce Hook
// --------------------
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};


// --------------------
// HOC
// --------------------
const withFilterableData = (WrappedComponent, httpComp) => {
  return function EnhancedComponent() {
    const [searchInput, setSearchInput] = useState("");
    const [allData, setAllData] = useState([]);
    const [apiData, setApiData] = useState([]);

    const debouncedSearchInput = useDebounce(searchInput, 300);

    // API call once
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await httpComp();
          setAllData(data);
          setApiData(data);
        } catch (err) {
          console.log(err);
        }
      };

      fetchData();
    }, []);

    // Filter data
    useEffect(() => {
      if (debouncedSearchInput) {
        const filtered = allData.filter(item =>
          item.title.toLowerCase().includes(debouncedSearchInput.toLowerCase())
        );
        setApiData(filtered);
      } else {
        setApiData(allData);
      }
    }, [debouncedSearchInput, allData]);

    return (
      <>
        {/* 🔥 SEARCH INPUT ADDED HERE */}
        <input
          type="text"
          placeholder="Search posts..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ padding: "8px", marginBottom: "10px", width: "300px" }}
        />

        <WrappedComponent apiData={apiData} />
      </>
    );
  };
};


// --------------------
// API CALL
// --------------------
const httpComp = async () => {
  console.log("API Called");
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  return await res.json();
};


// --------------------
// UI Component
// --------------------
const ShowApiData = ({ apiData }) => {
  return (
    <div>
      {apiData.length > 0 ? (
        apiData.map((item) => (
          <div key={item.id} style={{ padding: "5px", borderBottom: "1px solid #ccc" }}>
            {item.title}
          </div>
        ))
      ) : (
        <p>No data found</p>
      )}
    </div>
  );
};


// --------------------
// Export
// --------------------
const ReturnHOCInputCom = withFilterableData(ShowApiData, httpComp);

export default ReturnHOCInputCom;
