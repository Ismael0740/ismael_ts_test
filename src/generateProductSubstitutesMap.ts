import * as dateFns from 'date-fns';
import * as lodash from 'lodash';

export type Product = {
  id: string;
  replacementProductId?: string;
  replacementDate?: Date;
};
/**
 * left original product, right replacementProductId
 */
type ProductsMap = Map<Product['id'], Product['id']>;
type Returned = {
  map: ProductsMap;
  productsWithErrors?: Array<Product['id']>;
};

/**
 *
 * @param products All shopify products, with typical properties and with discontinued product as "pointer" to other product
 */
export function generateProductSubstitutesMap(
  products: ReadonlyArray<Product>,
  now: Date = new Date()
): Returned {
  const map: ProductsMap = new Map();
  const productsWithErrors: string[] = []; //Dont touch this
  const productsIndexed = generateProductsByIdIndex(products); //This is for getting a product by id with O(1) cost

  // YOUR CODE GOES HERE

  products.forEach((product) => {
    var counter = 0;
    var bool = true;
    let id = product.id;
    let replacementProductId = product.replacementProductId;
    let replacementDate = product.replacementDate;

    while (bool) {
      if (replacementProductId == undefined) {
        bool = false;

        if (counter > 0) {
          map.set(product.id, id);
        }
      } else {
        if (replacementDate! > now) {
          bool = false;

          if (counter > 0) {
            map.set(product.id, id);
          }
        } else {
          id = replacementProductId;
          replacementProductId = productsIndexed.get(id)?.replacementProductId;
          replacementDate = productsIndexed.get(id)?.replacementDate;
          counter++;
        }
      }
    }
  });

  return { map, productsWithErrors };
}

/**
 * This generates a index for searching products with cost O(1)
 * The key is the product id and will always return the product if you use a correct productId
 *
 * @param products The list of products
 * @returns
 */
function generateProductsByIdIndex(products: ReadonlyArray<Product>): Map<Product['id'], Product> {
  return new Map(lodash.map(products, (product) => [product.id, product]));
}

export default generateProductSubstitutesMap;
