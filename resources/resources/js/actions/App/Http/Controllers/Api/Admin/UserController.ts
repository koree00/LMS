import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\Admin\UserController::store
 * @see app/Http/Controllers/Api/Admin/UserController.php:13
 * @route '/api/admin/users'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/admin/users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\Admin\UserController::store
 * @see app/Http/Controllers/Api/Admin/UserController.php:13
 * @route '/api/admin/users'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\Admin\UserController::store
 * @see app/Http/Controllers/Api/Admin/UserController.php:13
 * @route '/api/admin/users'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\Admin\UserController::store
 * @see app/Http/Controllers/Api/Admin/UserController.php:13
 * @route '/api/admin/users'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\Admin\UserController::store
 * @see app/Http/Controllers/Api/Admin/UserController.php:13
 * @route '/api/admin/users'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const UserController = { store }

export default UserController