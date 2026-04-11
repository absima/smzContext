import Product from '../components/product';
import LoadingIndicator from '../components/loading';
import Message from '../components/message';
import { Row } from 'react-bootstrap';

import { Outlet, useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { ProjContext } from '../contexter';

export default function SearchPart() {
  const { products, loading, error } = useContext(ProjContext);

  const [searchParams] = useSearchParams();
  const filterRaw = searchParams.get('filter');

  const normalize = (v) =>
    (v ?? '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, '');

  const filterTerms = (filterRaw || '')
    .split(/\s+/)
    .map(normalize)
    .filter(Boolean);

  return (
    <div className="container maindiv">
      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row className="product-grid">
          {(products ?? [])
            .filter((product) => {
              if (filterTerms.length === 0) return true;

              const title = normalize(product?.title);
              const brand = normalize(product?.brand);
              const category = normalize(product?.category);
              const tags = Array.isArray(product?.tags)
                ? normalize(product.tags.join(' '))
                : '';

              // return filterTerms.some(
              //   (term) =>
              //     title.includes(term) ||
              //     brand.includes(term) ||
              //     category.includes(term) ||
              //     tags.includes(term)
              // );
              return filterTerms.some((term) => {
                return (
                  title.includes(term) ||
                  brand.includes(term) ||
                  category === term ||   // ✅ exact match
                  tags.includes(term)
                );
              });
            })
            .map((item) => (
              <Product key={item._id || item.id} product={item} />
            ))}
        </Row>
      )}
      <Outlet />
    </div>
  );
}