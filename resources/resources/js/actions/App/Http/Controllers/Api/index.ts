import AuthController from './AuthController'
import Admin from './Admin'
import StudentController from './StudentController'
const Api = {
    AuthController: Object.assign(AuthController, AuthController),
Admin: Object.assign(Admin, Admin),
StudentController: Object.assign(StudentController, StudentController),
}

export default Api