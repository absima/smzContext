import { useEffect, useRef, useState, useContext } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { ProjContext } from '../contexter';

const CATEGORY_GROUPS = [
  {
    value: 'tech',
    label: 'Tech',
    terms: ['laptops', 'smartphones', 'tablets', 'mobile-accessories'],
  },
  {
    value: 'women',
    label: 'Women',
    terms: [
      'womens-dresses',
      'womens-shoes',
      'womens-watches',
      'womens-bags',
      'womens-jewellery',
      'tops',
    ],
  },
  {
    value: 'men',
    label: 'Men',
    terms: ['mens-shirts', 'mens-shoes', 'mens-watches'],
  },
  {
    value: 'home',
    label: 'Home',
    terms: ['furniture', 'home-decoration', 'kitchen-accessories'],
  },
  {
    value: 'beauty',
    label: 'Beauty',
    terms: ['beauty', 'skin-care', 'fragrances', 'sunglasses'],
  },
  {
    value: 'groceries',
    label: 'Groceries',
    terms: ['groceries'],
  },
  {
    value: 'sports',
    label: 'Sports',
    terms: ['sports-accessories'],
  },
  {
    value: 'vehicles',
    label: 'Vehicles',
    terms: ['motorcycle', 'vehicle'],
  },
];

export default function HeaderPart() {
  const { customer, setCustomer, loggedin, setLoggedin, cartItems } =
    useContext(ProjContext);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilter] = useState(searchParams.get('filter') || '');
  const [category, setCategory] = useState('');

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCustomer(null);
    setLoggedin(false);
    setMenuOpen(false);
    navigate('/login');
  };

  const handleSelect = (e) => {
    const value = e.target.value;
    setCategory(value);
    setMenuOpen(false);

    if (!value) {
      setFilter('');
      setSearchParams({});
      navigate('/search');
      return;
    }

    const selectedGroup = CATEGORY_GROUPS.find((group) => group.value === value);
    const searchValue = selectedGroup ? selectedGroup.terms.join(' ') : value;

    setFilter('');
    setSearchParams({ filter: searchValue });
    navigate(`/search?filter=${encodeURIComponent(searchValue)}`);
  };

  const handleFilter = (e) => {
    const value = e.target.value;
    setFilter(value);
    setCategory('');
    setSearchParams(value ? { filter: value } : {});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = (filter || '').trim();
    setMenuOpen(false);

    if (q) {
      setSearchParams({ filter: q });
      navigate(`/search?filter=${encodeURIComponent(q)}`);
    } else {
      setSearchParams({});
      navigate('/products');
    }
  };

  return (
    <header>
      <Container>
        <Row className="headerRow">
          <Col xs={12} className="headerTop">
            <Link className="brand" to="/">
              simazon
            </Link>

            <div className="headerActions">
              {loggedin && customer ? (
                <div className="dropdown" ref={menuRef}>
                  <button
                    type="button"
                    className="dropdown-toggle-btn"
                    onClick={() => setMenuOpen((v) => !v)}
                  >
                    {customer.username} <i className="fa fa-caret-down"></i>
                  </button>

                  {menuOpen && (
                    <ul className="dropdown-content">
                      <li>
                        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/profile/edit"
                          onClick={() => setMenuOpen(false)}
                        >
                          Edit profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/orders" onClick={() => setMenuOpen(false)}>
                          My orders
                        </Link>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="dropdown-link-btn"
                          onClick={handleLogout}
                        >
                          Log out
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              ) : (
                <Link to="/login">Log in</Link>
              )}

              <Link to="/cart" className="cartLink">
                <FontAwesomeIcon icon={faCartShopping} size="lg" />
                {cartItems > 0 && <span className="notif">{cartItems}</span>}
              </Link>
            </div>
          </Col>

          <Col xs={12}>
            <div className="headerSearch">
              <select
                className="header-select"
                name="category"
                value={category}
                onChange={handleSelect}
              >
                <option value="" disabled>
                  select
                </option>
                {CATEGORY_GROUPS.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>

              <Form className="header-form" onSubmit={handleSubmit}>
                <input
                  className="header-input"
                  name="search"
                  type="text"
                  placeholder="Search..."
                  value={filter}
                  onChange={handleFilter}
                />

                <button
                  type="submit"
                  className="header-submit"
                  aria-label="Search"
                >
                  <i className="fa fa-search"></i>
                </button>
              </Form>
            </div>
          </Col>
        </Row>

        <hr />
      </Container>
    </header>
  );
}