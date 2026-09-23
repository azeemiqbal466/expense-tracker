import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

import { toast } from "react-toastify";

import api from "../services/api.js";


const Layout = () => {

  // =====================================================
  // AUTH
  // =====================================================

  const { user, logout } = useAuth();

  const navigate = useNavigate();


  // =====================================================
  // THEME
  // =====================================================

  const { theme, toggleTheme } = useTheme();


  // =====================================================
  // LOCATION
  // =====================================================

  const location = useLocation();


  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );


  // =====================================================
  // SEARCH
  // =====================================================

  const [search, setSearch] = useState("");

  const [incomes, setIncomes] = useState([]);

  const [expenses, setExpenses] = useState([]);

  const searchRef = useRef(null);


  // =====================================================
  // PROFILE IMAGE LISTENER
  // =====================================================

  useEffect(() => {

    const updateProfileImage = () => {

      setProfileImage(
        localStorage.getItem("profileImage") || ""
      );

    };


    window.addEventListener(
      "profile-image-updated",
      updateProfileImage
    );


    return () => {

      window.removeEventListener(
        "profile-image-updated",
        updateProfileImage
      );

    };

  }, []);


  // =====================================================
  // LOAD SEARCH DATA
  // =====================================================

  useEffect(() => {

    const loadSearchData = async () => {

      try {

        const [incomeResponse, expenseResponse] =
          await Promise.all([
            api.get("/income"),
            api.get("/expense")
          ]);


        setIncomes(
          incomeResponse.data
        );


        setExpenses(
          expenseResponse.data
        );

      } catch (error) {

        console.log(
          "Search data loading error:",
          error
        );

      }

    };


    loadSearchData();

  }, []);


  // =====================================================
  // CTRL + K SEARCH SHORTCUT
  // =====================================================

  useEffect(() => {

    const handleKeyboard = (event) => {

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {

        event.preventDefault();

        searchRef.current?.focus();

      }

    };


    document.addEventListener(
      "keydown",
      handleKeyboard
    );


    return () => {

      document.removeEventListener(
        "keydown",
        handleKeyboard
      );

    };

  }, []);


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    logout();

    toast.success(
      "Logged out successfully!"
    );

    navigate("/login");

  };


  // =====================================================
  // SIDEBAR ACTIVE LINK
  // =====================================================

  const linkClass = ({ isActive }) => {

    return `sidebar-link ${
      isActive ? "active" : ""
    }`;

  };


  // =====================================================
  // USER INITIAL
  // =====================================================

  const firstLetter = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "U";


  // =====================================================
  // PAGE INFORMATION
  // =====================================================

  const getPageInfo = () => {

    switch (location.pathname) {

      case "/dashboard":

        return {
          title: "Dashboard",
          subtitle: "Financial overview"
        };


      case "/income":

        return {
          title: "Income",
          subtitle: "Manage your income"
        };


      case "/expenses":

        return {
          title: "Expenses",
          subtitle: "Manage your spending"
        };


      case "/reports":

        return {
          title: "Reports",
          subtitle: "Financial analytics"
        };


      case "/profile":

        return {
          title: "Profile",
          subtitle: "Account settings"
        };


      default:

        return {
          title: "ExpenseTrack",
          subtitle: "Personal Finance"
        };

    }

  };


  const pageInfo = getPageInfo();


  // =====================================================
  // SEARCH RESULTS
  // =====================================================

  const searchResults = useMemo(() => {

    const query = search
      .trim()
      .toLowerCase();


    if (!query) {
      return [];
    }


    const incomeResults = incomes
      .filter((item) => {

        const text = `
          ${item.title || ""}
          ${item.category || ""}
          ${item.description || ""}
        `.toLowerCase();


        return text.includes(query);

      })
      .map((item) => ({

        ...item,

        type: "income"

      }));


    const expenseResults = expenses
      .filter((item) => {

        const text = `
          ${item.title || ""}
          ${item.category || ""}
          ${item.description || ""}
        `.toLowerCase();


        return text.includes(query);

      })
      .map((item) => ({

        ...item,

        type: "expense"

      }));


    return [
      ...incomeResults,
      ...expenseResults
    ]
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 6);

  }, [
    search,
    incomes,
    expenses
  ]);


  // =====================================================
  // SEARCH RESULT CLICK
  // =====================================================

  const handleSearchResult = (item) => {

    setSearch("");


    if (item.type === "income") {

      navigate("/income");

    } else {

      navigate("/expenses");

    }

  };


  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const clearSearch = () => {

    setSearch("");

    searchRef.current?.focus();

  };


  // =====================================================
  // SEARCH SUBMIT
  // =====================================================

  const handleSearchSubmit = (e) => {

    e.preventDefault();


    if (!search.trim()) {
      return;
    }


    if (searchResults.length > 0) {

      handleSearchResult(
        searchResults[0]
      );

      return;

    }


    toast.info(
      `No results found for "${search}"`
    );

  };


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div className="app-shell">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">


        {/* BRAND */}

        <div className="brand-wrap">

          <div className="brand-logo">

            <i className="bi bi-wallet2"></i>

          </div>


          <div>

            <div className="brand-name">
              ExpenseTrack
            </div>

            <div className="brand-tagline">
              Personal Finance
            </div>

          </div>

        </div>


        {/* MAIN MENU */}

        <div className="sidebar-title">
          MAIN MENU
        </div>


        <nav className="side-nav">


          {/* DASHBOARD */}

          <NavLink
            to="/dashboard"
            className={linkClass}
          >

            <span className="menu-icon">

              <i className="bi bi-grid-1x2-fill"></i>

            </span>

            <span>
              Dashboard
            </span>

          </NavLink>


          {/* INCOME */}

          <NavLink
            to="/income"
            className={linkClass}
          >

            <span className="menu-icon income-icon">

              <i className="bi bi-arrow-down-circle-fill"></i>

            </span>

            <span>
              Income
            </span>

          </NavLink>


          {/* EXPENSES */}

          <NavLink
            to="/expenses"
            className={linkClass}
          >

            <span className="menu-icon expense-icon">

              <i className="bi bi-arrow-up-circle-fill"></i>

            </span>

            <span>
              Expenses
            </span>

          </NavLink>


          {/* REPORTS */}

          <NavLink
            to="/reports"
            className={linkClass}
          >

            <span className="menu-icon">

              <i className="bi bi-bar-chart-fill"></i>

            </span>

            <span>
              Reports
            </span>

          </NavLink>

        </nav>


        {/* ACCOUNT */}

        <div className="sidebar-title account-title">
          ACCOUNT
        </div>


        <nav className="side-nav">

          <NavLink
            to="/profile"
            className={linkClass}
          >

            <span className="menu-icon">

              <i className="bi bi-person-fill"></i>

            </span>

            <span>
              Profile
            </span>

          </NavLink>

        </nav>


        {/* SIDEBAR TIP */}

        <div className="sidebar-tip">

          <div className="tip-icon">

            <i className="bi bi-lightbulb-fill"></i>

          </div>


          <div>

            <strong>
              Smart tracking
            </strong>

            <small>
              Keep your income and expenses updated.
            </small>

          </div>

        </div>


        {/* SIDEBAR USER */}

        <div className="sidebar-user">

          <div className="sidebar-avatar">

            {profileImage ? (

              <img
                src={profileImage}
                alt="Profile"
              />

            ) : (

              firstLetter

            )}

          </div>


          <div className="sidebar-user-info">

            <strong>
              {user?.name}
            </strong>

            <span>
              {user?.email}
            </span>

          </div>


          <button
            type="button"
            className="logout-icon"
            onClick={handleLogout}
            title="Logout"
          >

            <i className="bi bi-box-arrow-right"></i>

          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main-content">


        {/* =================================================
            TOP NAVBAR
        ================================================= */}

        <header className="topbar">


          {/* LEFT */}

          <div className="navbar-left">


            {/* MOBILE BRAND */}

            <div className="mobile-brand">

              <div className="brand-logo small">

                <i className="bi bi-wallet2"></i>

              </div>

              <span>
                ExpenseTrack
              </span>

            </div>


            {/* PAGE INFO */}

            <div className="navbar-page-info">

              <h5>
                {pageInfo.title}
              </h5>

              <span>
                {pageInfo.subtitle}
              </span>

            </div>

          </div>


          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="navbar-search-wrapper">

            <form
              className="navbar-search"
              onSubmit={handleSearchSubmit}
            >

              <i className="bi bi-search"></i>


              <input
                ref={searchRef}
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />


              {/* CLEAR BUTTON */}

              {search && (

                <button
                  type="button"
                  className="search-clear"
                  onClick={clearSearch}
                  title="Clear search"
                >

                  <i className="bi bi-x"></i>

                </button>

              )}


              {/* SHORTCUT */}

              {!search && (

                <span className="search-shortcut">
                  Ctrl K
                </span>

              )}

            </form>


            {/* =================================================
                SEARCH RESULTS DROPDOWN
            ================================================= */}

            {search.trim() && (

              <div className="search-results-dropdown">


                {searchResults.length > 0 ? (

                  <>

                    <div className="search-results-header">

                      <span>
                        Search Results
                      </span>

                      <small>
                        {searchResults.length} found
                      </small>

                    </div>


                    {searchResults.map((item) => (

                      <button
                        type="button"
                        className="search-result-item"
                        key={`${item.type}-${item._id}`}
                        onClick={() =>
                          handleSearchResult(item)
                        }
                      >


                        {/* ICON */}

                        <div
                          className={
                            item.type === "income"
                              ? "search-result-icon income"
                              : "search-result-icon expense"
                          }
                        >

                          <i
                            className={
                              item.type === "income"
                                ? "bi bi-arrow-down-left"
                                : "bi bi-arrow-up-right"
                            }
                          ></i>

                        </div>


                        {/* TEXT */}

                        <div className="search-result-info">

                          <strong>
                            {item.title}
                          </strong>

                          <span>
                            {item.category}
                            {" • "}
                            {new Date(
                              item.date
                            ).toLocaleDateString()}
                          </span>

                        </div>


                        {/* AMOUNT */}

                        <div
                          className={
                            item.type === "income"
                              ? "search-result-amount income"
                              : "search-result-amount expense"
                          }
                        >

                          {item.type === "income"
                            ? "+"
                            : "-"}

                          {" Rs. "}

                          {Number(
                            item.amount
                          ).toLocaleString()}

                        </div>

                      </button>

                    ))}

                  </>

                ) : (

                  <div className="search-no-results">

                    <div className="search-empty-icon">

                      <i className="bi bi-search"></i>

                    </div>

                    <strong>
                      No results found
                    </strong>

                    <span>
                      Try another title or category.
                    </span>

                  </div>

                )}

              </div>

            )}

          </div>


          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="navbar-right">


            {/* NOTIFICATIONS */}

            <button
              type="button"
              className="navbar-icon-button"
              title="Notifications"
              onClick={() =>
                toast.info(
                  "No new notifications"
                )
              }
            >

              <i className="bi bi-bell"></i>

              <span className="notification-dot">
                2
              </span>

            </button>


            {/* THEME */}

            <button
              type="button"
              className="navbar-icon-button"
              onClick={toggleTheme}
              title={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >

              <i
                className={
                  theme === "light"
                    ? "bi bi-moon-stars-fill"
                    : "bi bi-sun-fill"
                }
              ></i>

            </button>


            {/* DATE */}

            <div className="navbar-date">

              <div className="navbar-date-icon">

                <i className="bi bi-calendar3"></i>

              </div>


              <div>

                <span>
                  Today
                </span>

                <strong>

                  {new Date().toLocaleDateString(
                    undefined,
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    }
                  )}

                </strong>

              </div>

            </div>


            {/* DIVIDER */}

            <div className="navbar-divider"></div>


            {/* PROFILE */}

            <NavLink
              to="/profile"
              className="navbar-profile"
            >

              <div className="navbar-avatar">

                {profileImage ? (

                  <img
                    src={profileImage}
                    alt="Profile"
                  />

                ) : (

                  firstLetter

                )}

              </div>


              <div className="navbar-profile-info">

                <strong>
                  {user?.name}
                </strong>

                <span>
                  My Account
                </span>

              </div>


              <i className="bi bi-chevron-down navbar-chevron"></i>

            </NavLink>

          </div>

        </header>


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <div className="page-content">

          <Outlet />

        </div>

      </main>

    </div>
  );
};


export default Layout;