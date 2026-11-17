import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\StudentController::index
 * @see app/Http/Controllers/Api/StudentController.php:16
 * @route '/api/teacher/students'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/teacher/students',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StudentController::index
 * @see app/Http/Controllers/Api/StudentController.php:16
 * @route '/api/teacher/students'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StudentController::index
 * @see app/Http/Controllers/Api/StudentController.php:16
 * @route '/api/teacher/students'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StudentController::index
 * @see app/Http/Controllers/Api/StudentController.php:16
 * @route '/api/teacher/students'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StudentController::index
 * @see app/Http/Controllers/Api/StudentController.php:16
 * @route '/api/teacher/students'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StudentController::index
 * @see app/Http/Controllers/Api/StudentController.php:16
 * @route '/api/teacher/students'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StudentController::index
 * @see app/Http/Controllers/Api/StudentController.php:16
 * @route '/api/teacher/students'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Api\StudentController::store
 * @see app/Http/Controllers/Api/StudentController.php:34
 * @route '/api/teacher/students'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/teacher/students',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\StudentController::store
 * @see app/Http/Controllers/Api/StudentController.php:34
 * @route '/api/teacher/students'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StudentController::store
 * @see app/Http/Controllers/Api/StudentController.php:34
 * @route '/api/teacher/students'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\StudentController::store
 * @see app/Http/Controllers/Api/StudentController.php:34
 * @route '/api/teacher/students'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\StudentController::store
 * @see app/Http/Controllers/Api/StudentController.php:34
 * @route '/api/teacher/students'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const StudentController = { index, store }

export default StudentController