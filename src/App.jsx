class ProductList extends React.Component {
    constructor() {
        super();
        this.state = { products: [] };
        this.createProduct = this.createProduct.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        const query = `query {
          productList {
            product_category product_name product_price product_image
          }
        }`;

        const data = await graphQLFetch(query);

        this.setState({ products: data.productList });

    }

    async createProduct(product) {
        product.id = this.state.products.length + 1;
        const newProducts = this.state.products.slice();
        newProducts.push(product)
        this.setState({ products: newProducts });
        const query = `mutation {
            productAdd(product: {
            product_category: ${product.product_category}
            product_name: "${product.product_name}"
            product_price: "${product.product_price}"
            product_image: "${product.product_image}"
          }) {
            id
          }
        }`;

        const data = await graphQLFetch(query);
        if (data) {
            this.loadData();
        }
    }

    // createProduct(product) {
    //     // product.id = new Date().getTime();
    //     const newProducts = this.state.products.slice();
    //     newProducts.push(product)
    //     this.setState({ products: newProducts });
    // }

    render() {
        return (
            <div title="Inner Div">
                <h1 className="headerClass"> My Company Inventory </h1>
                <h2 className="headerClass"> Showing all available products </h2>
                <hr />
                <ProductTable products={this.state.products} />
                <h2>Add a new product to the inventory</h2>
                <hr />
                <ProductAdd createProduct={this.createProduct} />
            </div>
        );
    }
}

function ProductTable(props) {
    const productRows = props.products.map((product) =>
        <ProductRow key={product.id} product={product} />
    );

    return (
        <div >
            <table className="bordered-table" >
                <thead>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Image</th>
                </thead>
                <tbody>
                    {productRows}
                </tbody>
            </table>
        </div>
    );
}

class ProductAdd extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.productAddForm
        const price = form.productPrice.value
        const product = { product_name: form.productName.value, product_price: price.substring(1, price.length), product_category: form.productCategory.value, product_image: form.productImage.value }
        this.props.createProduct(product)
        form.productName.value = "";
        form.productPrice.value = "$";
        form.productImage.value = "";
    }

    render() {
        return (
            <div>
                <form name="productAddForm" onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="column">
                            <h4 className="addFormTitle">Product Category</h4>
                            <select name="productCategory">
                                <option >Shirts</option>
                                <option >Jeans</option>
                                <option >Jackets</option>
                                <option >Sweaters</option>
                                <option >Accessories</option>
                            </select>

                            <h4 className="addFormTitle">Product Name</h4>
                            <input type="text" name="productName" placeholder="Product Name" />
                        </div>
                        <div className="column">
                            <h4 className="addFormTitle">Product Price</h4>
                            <input defaultValue="$" type="text" name="productPrice" />

                            <h4 className="addFormTitle">Image URL</h4>
                            <input type="text" name="productImage" placeholder="Product Image" />
                        </div>
                    </div>

                    <br />
                    <button>Add Product</button>
                </form>
            </div>
        );
    };
}

function ProductRow(props) {
    const product = props.product;

    return (
        <tr>
            <td>{product.product_name}</td>
            <td>${product.product_price}</td>
            <td>{product.product_category}</td>
            <td><a href={product.product_image} target="_blank">View</a></td>
        </tr>
    );
};

async function graphQLFetch(query) {
    const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);
}


const element = <ProductList />

ReactDOM.render(element, document.getElementById('content'));