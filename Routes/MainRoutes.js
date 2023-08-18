
const UserRoute = require('./UserRoute')
const ItemRoute = require('./ItemRoute')
const ClientRoute = require('./ClientRoute')
const OrderRoute = require('./OrderRoute')
const RGoodsRoute = require('./RGoodsRoute')
const DGoodsRoute = require('./DGoodsRoute')
const ProductionRoute = require('./ProductionRoute')
const InvoiceRoutes = require('./InvoiceRoutes')
const PaymentRoutes = require('./PaymentRoute')



const routes = [
    {
        path: '/item/',
        handler: ItemRoute
    },
    {
        path: '/api/clients/',
        handler: ClientRoute
    },
    {
        path: '/api/user/',
        handler: UserRoute
    },
    {
        path: '/api/orders/',
        handler: OrderRoute
    },
    {
        path: '/api/rec-goods/',
        handler: RGoodsRoute
    },
    {
        path: '/api/del-goods/',
        handler: DGoodsRoute
    },
    {
        path: '/api/production/',
        handler: ProductionRoute
    },
    {
        path: '/api/invoice/',
        handler: InvoiceRoutes
    },
    {
        path: '/api/payments/',
        handler: PaymentRoutes
    },
]

module.exports = app => {
    routes.forEach(r => {
        if (r.path === '/') {
            app.get(r.path, r.handler)
        } else {
            app.use(r.path, r.handler)
        }
    })
}