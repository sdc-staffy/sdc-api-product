const {db} = require('./index');
const {getAllProducts, getProductInfo, getStyleInfo, getRelatedProducts} = require('./controller')

jest.mock('./db/db.js', () => {
    return {
        query: jest.fn(),
        end: jest.fn(),
    };
});

describe('getAllProducts', () => {
    it('should fetch all products', async () => {
        const mockData = {
            rows: [
                { product_info: { id: 1, name: 'Product 1' } },
                { product_info: { id: 2, name: 'Product 2' } },
            ]
        };
        db.query.mockResolvedValue(mockData);

        const data = await getAllProducts(5);
        expect(data).toEqual([{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }]);
    });
});

describe('getProductInfo', () => {
    it('should fetch product info', async () => {
        const mockData = {
            rows: [{ product_info: { id: 1, name: 'Product 1', features: [] } }]
        };
        db.query.mockResolvedValue(mockData);

        const data = await getProductInfo(1);
        expect(data).toEqual({ id: 1, name: 'Product 1', features: [] });
    });
});

describe('getStyleInfo', () => {
    it('should fetch style info', async () => {
        const mockData = {
            rows: [{ styles_info: { product_id: 1, results: [] } }]
        };
        db.query.mockResolvedValue(mockData);

        const data = await getStyleInfo(1);
        expect(data).toEqual({ product_id: 1, results: [] });
    });
});

describe('getRelatedProducts', () => {
    it('should fetch related products', async () => {
        const mockData = {
            rows: [{ related_info: [2, 3, 4] }]
        };
        db.query.mockResolvedValue(mockData);

        const data = await getRelatedProducts(1);
        expect(data).toEqual([2, 3, 4]);
    });
});

afterAll(() => {
    db.end();
  });