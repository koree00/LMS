[33mcommit 97fdd0730a3516286851f184cee532190ddb8668[m[33m ([m[1;31morigin/main[m[33m, [m[1;31morigin/HEAD[m[33m)[m
Author: Koree00 <jillbasbas122917@gmail.com>
Date:   Fri Nov 6 17:11:37 2026 +0800

    initial commit

[1mdiff --git a/.editorconfig b/.editorconfig[m
[1mnew file mode 100644[m
[1mindex 0000000..6df8428[m
[1m--- /dev/null[m
[1m+++ b/.editorconfig[m
[36m@@ -0,0 +1,18 @@[m
[32m+[m[32mroot = true[m
[32m+[m
[32m+[m[32m[*][m
[32m+[m[32mcharset = utf-8[m
[32m+[m[32mend_of_line = lf[m
[32m+[m[32mindent_size = 4[m
[32m+[m[32mindent_style = space[m
[32m+[m[32minsert_final_newline = true[m
[32m+[m[32mtrim_trailing_whitespace = true[m
[32m+[m
[32m+[m[32m[*.md][m
[32m+[m[32mtrim_trailing_whitespace = false[m
[32m+[m
[32m+[m[32m[*.{yml,yaml}][m
[32m+[m[32mindent_size = 2[m
[32m+[m
[32m+[m[32m[{compose,docker-compose}.{yml,yaml}][m
[32m+[m[32mindent_size = 4[m
[1mdiff --git a/.env.example b/.env.example[m
[1mnew file mode 100644[m
[1mindex 0000000..40bb13b[m
[1m--- /dev/null[m
[1m+++ b/.env.example[m
[36m@@ -0,0 +1,65 @@[m
[32m+[m[32mAPP_NAME=Laravel[m
[32m+[m[32mAPP_ENV=local[m
[32m+[m[32mAPP_KEY=[m
[32m+[m[32mAPP_DEBUG=true[m
[32m+[m[32mAPP_URL=http://localhost:8000[m
[32m+[m
[32m+[m[32mAPP_LOCALE=en[m
[32m+[m[32mAPP_FALLBACK_LOCALE=en[m
[32m+[m[32mAPP_FAKER_LOCALE=en_US[m
[32m+[m
[32m+[m[32mAPP_MAINTENANCE_DRIVER=file[m
[32m+[m[32m# APP_MAINTENANCE_STORE=database[m
[32m+[m
[32m+[m[32m# PHP_CLI_SERVER_WORKERS=4[m
[32m+[m
[32m+[m[32mBCRYPT_ROUNDS=12[m
[32m+[m
[32m+[m[32mLOG_CHANNEL=stack[m
[32m+[m[32mLOG_STACK=single[m
[32m+[m[32mLOG_DEPRECATIONS_CHANNEL=null[m
[32m+[m[32mLOG_LEVEL=debug[m
[32m+[m
[32m+[m[32mDB_CONNECTION=sqlite[m
[32m+[m[32m# DB_HOST=127.0.0.1[m
[32m+[m[32m# DB_PORT=3306[m
[32m+[m[32m# DB_DATABASE=laravel[m
[32m+[m[32m# DB_USERNAME=root[m
[32m+[m[32m# DB_PASSWORD=[m
[32m+[m
[32m+[m[32mSESSION_DRIVER=database[m
[32m+[m[32mSESSION_LIFETIME=120[m
[32m+[m[32mSESSION_ENCRYPT=false[m
[32m+[m[32mSESSION_PATH=/[m
[32m+[m[32mSESSION_DOMAIN=null[m
[32m+[m
[32m+[m[32mBROADCAST_CONNECTION=log[m
[32m+[m[32mFILESYSTEM_DISK=local[m
[32m+[m[32mQUEUE_CONNECTION=database[m
[32m+[m
[32m+[m[32mCACHE_STORE=database[m
[32m+[m[32m# CACHE_PREFIX=[m
[32m+[m
[32m+[m[32mMEMCACHED_HOST=127.0.0.1[m
[32m+[m
[32m+[m[32mREDIS_CLIENT=phpredis[m
[32m+[m[32mREDIS_HOST=127.0.0.1[m
[32m+[m[32mREDIS_PASSWORD=null[m
[32m+[m[32mREDIS_PORT=6379[m
[32m+[m
[32m+[m[32mMAIL_MAILER=log[m
[32m+[m[32mMAIL_SCHEME=null[m
[32m+[m[32mMAIL_HOST=127.0.0.1[m
[32m+[m[32mMAIL_PORT=2525[m
[32m+[m[32mMAIL_USERNAME=null[m
[32m+[m[32mMAIL_PASSWORD=null[m
[32m+[m[32mMAIL_FROM_ADDRESS="hello@example.com"[m
[32m+[m[32mMAIL_FROM_NAME="${APP_NAME}"[m
[32m+[m
[32m+[m[32mAWS_ACCESS_KEY_ID=[m
[32m+[m[32mAWS_SECRET_ACCESS_KEY=[m
[32m+[m[32mAWS_DEFAULT_REGION=us-east-1[m
[32m+[m[32mAWS_BUCKET=[m
[32m+[m[32mAWS_USE_PATH_STYLE_ENDPOINT=false[m
[32m+[m
[32m+[m[32mVITE_APP_NAME="${APP_NAME}"[m
[1mdiff --git a/.gitattributes b/.gitattributes[m
[1mnew file mode 100644[m
[1mindex 0000000..f50f803[m
[1m--- /dev/null[m
[1m+++ b/.gitattributes[m
[36m@@ -0,0 +1,10 @@[m
[32m+[m[32m* text=auto eol=lf[m
[32m+[m
[32m+[m[32m*.blade.php diff=html[m
[32m+[m[32m*.css diff=css[m
[32m+[m[32m*.html diff=html[m
[32m+[m[32m*.md diff=markdown[m
[32m+[m[32m*.php diff=php[m
[32m+[m
[32m+[m[32mCHANGELOG.md export-ignore[m
[32m+[m[32mREADME.md export-ignore[m
[1mdiff --git a/.github/dependabot.yml b/.github/dependabot.yml[m
[1mnew file mode 100644[m
[1mindex 0000000..ae67c4d[m
[1m--- /dev/null[m
[1m+++ b/.github/dependabot.yml[m
[36m@@ -0,0 +1,12 @@[m
[32m+[m[32mversion: 2[m
[32m+[m[32mupdates:[m
[32m+[m[32m  - package-ecosystem: "github-actions"[m
[32m+[m[32m    directory: "/"[m
[32m+[m[32m    schedule:[m
[32m+[m[32m      interval: "weekly"[m
[32m+[m[32m    cooldown:[m
[32m+[m[32m      default-days: 5[m
[32m+[m[32m    groups:[m
[32m+[m[32m      github-actions:[m
[32m+[m[32m        patterns:[m
[32m+[m[32m          - "*"[m
[1mdiff --git a/.github/workflows/tests.yml b/.github/workflows/tests.yml[m
[1mnew file mode 100644[m
[1mindex 0000000..38dbc09[m
[1m--- /dev/null[m
[1m+++ b/.github/workflows/tests.yml[m
[36m@@ -0,0 +1,38 @@[m
[32m+[m[32mname: tests[m
[32m+[m
[32m+[m[32mon:[m
[32m+[m[32m  push:[m
[32m+[m[32m    branches:[m
[32m+[m[32m      - main[m
[32m+[m[32m  pull_request:[m
[32m+[m
[32m+[m[32mpermissions:[m
[32m+[m[32m  contents: read[m
[32m+[m
[32m+[m[32mjobs:[m
[32m+[m[32m  ci:[m
[32m+[m[32m    runs-on: ubuntu-latest[m
[32m+[m
[32m+[m[32m    steps:[m
[32m+[m[32m      - name: Checkout code[m
[32m+[m[32m        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1[m
[32m+[m[32m        with:[m
[32m+[m[32m          persist-credentials: false[m
[32m+[m
[32m+[m[32m      - name: Setup PHP[m
[32m+[m[32m        uses: shivammathur/setup-php@eb7c497e18156a6bbabfef1d3a82760b9eda3962 # v2[m
[32m+[m[32m        with:[m
[32m+[m[32m          php-version: '8.5'[m
[32m+[m[32m          tools: composer:v2[m
[32m+[m[32m          coverage: none[m
[32m+[m
[32m+[m[32m      - name: Setup Node[m
[32m+[m[32m        uses: actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 # v7.1.0[m
[32m+[m[32m        with:[m
[32m+[m[32m          node-version: '22'[m
[32m+[m
[32m+[m[32m      - name: Setup Application[m
[32m+[m[32m        run: composer setup[m
[32m+[m
[32m+[m[32m      - name: Run CI Checks[m
[32m+[m[32m        run: composer ci:check[m
[1mdiff --git a/.gitignore b/.gitignore[m
[1mnew file mode 100644[m
[1mindex 0000000..44a2e9f[m
[1m--- /dev/null[m
[1m+++ b/.gitignore[m
[36m@@ -0,0 +1,44 @@[m
[32m+[m[32m/.phpunit.cache[m
[32m+[m[32m/bootstrap/ssr[m
[32m+[m[32m/node_modules[m
[32m+[m[32m/public/build[m
[32m+[m[32m/public/fonts-manifest.dev.json[m
[32m+[m[32m/public/hot[m
[32m+[m[32m/public/storage[m
[32m+[m[32m/resources/js/actions[m
[32m+[m[32m/resources/js/routes[m
[32m+[m[32m/resources/js/wayfinder[m
[32m+[m[32m/storage/*.key[m
[32m+[m[32m/storage/pail[m
[32m+[m[32m/vendor[m
[32m+[m[32m.env[m
[32m+[m[32m.env.backup[m
[32m+[m[32m.env.production[m
[32m+[m[32m.phpactor.json[m
[32m+[m[32m.phpunit.result.cache[m
[32m+[m[32mHomestead.json[m
[32m+[m[32mHomestead.yaml[m
[32m+[m[32mnpm-debug.log[m
[32m+[m[32myarn-error.log[m
[32m+[m[32m/auth.json[m
[32m+[m[32m/.fleet[m
[32m+[m[32m/.idea[m
[32m+[m[32m/.nova[m
[32m+[m[32m/.vscode[m
[32m+[m[32m/.zed[m
[32m+[m[32m/.agents[m
[32m+[m[32m/.amp[m
[32m+[m[32m/.claude[m
[32m+[m[32m/.codex[m
[32m+[m[32m/.cursor[m
[32m+[m[32m/.factory[m
[32m+[m[32m/.grok[m
[32m+[m[32m/.junie[m
[32m+[m[32m/.kiro[m
[32m+[m[32m/.pi[m
[32m+[m[32m/.mcp.json[m
[32m+[m[32m/AGENTS.md[m
[32m+[m[32m/CLAUDE.md[m
[32m+[m[32m/boost.json[m
[32m+[m[32m/opencode.json[m
[32m+[m[32m/opencode.jsonc[m
[1mdiff --git a/.npmrc b/.npmrc[m
[1mnew file mode 100644[m
[1mindex 0000000..97b895e[m
[1m--- /dev/null[m
[1m+++ b/.npmrc[m
[36m@@ -0,0 +1 @@[m
[32m+[m[32mignore-scripts=true[m
[1mdiff --git a/app/Enums/Role.php b/app/Enums/Role.php[m
[1mnew file mode 100644[m
[1mindex 0000000..4ae4562[m
[1m--- /dev/null[m
[1m+++ b/app/Enums/Role.php[m
[36m@@ -0,0 +1,12 @@[m
[32m+[m[32m<?php[m
[32m+[m
[32m+[m[32mnamespace App\Enums;[m
[32m+[m
[32m+[m[32menum Role: string[m
[32m+[m[32m{[m
[32m+[m[32m    case IctCoordinator = 'ict_coordinator';[m
[32m+[m[32m    case Principal = 'principal';[m
[32m+[m[32m    case SnedCoordinator = 'sned_coordinator';[m
[32m+[m[32m    case Teacher = 'teacher';[m
[32m+[m[32m    case Parent = 'parent';[m
[32m+[m[32m}[m
\ No newline at end of file[m
[1mdiff --git a/app/Http/Controllers/Api/Admin/UserController.php b/app/Http/Controllers/Api/Admin/UserController.php[m
[1mnew file mode 100644[m
[1mindex 0000000..7b2c95d[m
[1m--- /dev/null[m
[1m+++ b/app/Http/Controllers/Api/Admin/UserController.php[m
[36m@@ -0,0 +1,27 @@[m
[32m+[m[32m<?php[m
[32m+[m
[32m+[m[32mnamespace App\Http\Controllers\Api\Admin;[m
[32m+[m
[32m+[m[32muse App\Enums\Role;[m
[32m+[m[32muse App\Http\Controllers\Controller;[m
[32m+[m[32muse App\Models\User;[m
[32m+[m[32muse Illuminate\Http\Request;[m
[32m+[m[32muse Illuminate\Validation\Rule;[m
[32m+[m
[32m+[m[32mclass UserController extends Controller[m
[32m+[m[32m{[m
[32m+[m[32m    public function store(Request $request)[m
[32m+[m[32m    {[m
[32m+[m[32m        $data = $request->validate([[m
[32m+[m[32m            'name' => ['required', 'string', 'max:255'],[m
[32m+[m[32m            'email' => ['required', 'email', 'unique:users,email'],[m
[32m+[m[32m            'password' => ['required', 'string', 'min:8'],[m
[32m+[m[32m            'role' => ['required', Rule::enum(Role::class)],[m
[32m+[m[32m            'section_id' => ['nullable', 'exists:sections,id', 'required_if:role,teacher'],[m
[32m+[m[32m        ]);[m
[32m+[m
[32m+[m[32m        $user = User::create($data);[m
[32m+[m
[32m+[m[32m        return response()->json($user, 201);[m
[32m+[m[32m    }[m
[32m+[m[32m}[m
\ No newline at end of file[m
[1mdiff --git a/app/Http/Controllers/Api/AuthController.php b/app/Http/Controllers/Api/AuthController.php[m
[1mnew file mode 100644[m
[1mindex 0000000..ba97723[m
[1m--- /dev/null[m
[1m+++ b/app/Http/Controllers/Api/AuthController.php[m
[36m@@ -0,0 +1,67 @@[m
[32m+[m[32m<?php[m
[32m+[m
[32m+[m[32mnamespace App\Http\Controllers\Api;[m
[32m+[m
[32m+[m[32muse App\Http\Controllers\Controller;[m
[32m+[m[32muse App\Models\User;[m
[32m+[m[32muse Illuminate\Http\Request;[m
[32m+[m[32muse Illuminate\Support\Facades\Auth;[m
[32m+[m[32muse Illuminate\Support\Facades\Hash;[m
[32m+[m[32muse Illuminate\Validation\ValidationException;[m
[32m+[m
[32m+[m[32mclass AuthController extends Controller[m
[32m+[m[32m{[m
[32m+[m[32m    public function register(Request $request)[m
[32m+[m[32m    {[m
[32m+[m[32m        $data = $request->validate([[m
[32m+[m[32m            'name' => ['required', 'string', 'max:255'],[m
[32m+[m[32m            'email' => ['required', 'email', 'unique:users,email'],[m
[32m+[m[32m            'password' => ['required', 'string', 'min:8', 'confirmed'],[m
[32m+[m[32m        ]);[m
[32m+[m
[32m+[m[32m        $user = User::create([[m
[32m+[m[32m            'name' => $data['name'],[m
[32m+[m[32m            'email' => $data['email'],[m
[32m+[m[32m            'password' => Hash::make($data['password']),[m
[32m+[m[32m            'role' => 'teacher',[m
[32m+[m[32m        ]);[m
[32m+[m
[32m+[m[32m        return response()->json([[m
[32m+[m[32m            'user' => $user,[m
[32m+[m[32m            'token' => $user->createToken('teacher-token')->plainTextToken,[m
[32m+[m[32m        ], 201);[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    public function login(Request $request)[m
[32m+[m[32m    {[m
[32m+[m[32m        $data = $request->validate([[m
[32m+[m[32m            'email' => ['required', 'email'],[m
[32m+[m[32m            'password' => ['required', 'string'],[m
[32m+[m[32m        ]);[m
[32m+[m
[32m+[m[32m        if (! Auth::attempt($data)) {[m
[32m+[m[32m            throw ValidationException::withMessages([[m
[32m+[m[32m                'email' => ['The email or password is incorrect.'],[m
[32m+[m[32m            ]);[m
[32m+[m[32m        }[m
[32m+[m
[32m+[m[32m        $user = User::where('email', $data['email'])->firstOrFail();[m
[32m+[m
[32m+[m[32m        return response()->json([[m
[32m+[m[32m            'user' => $user,[m
[32m+[m[32m            'token' => $user->createToken('teacher-token')->plainTextToken,[m
[32m+[m[32m        ]);[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    public function me(Request $request)[m
[32m+[m[32m    {[m
[32m+[m[32m        return response()->json($request->user());[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    public function logout(Request $request)[m
[32m+[m[32m    {[m
[32m+[m[32m        $request->user()->currentAccessToken()->delete();[m
[32m+[m
[32m+[m[32m        return response()->json(['message' => 'Logged out.']);[m
[32m+[m[32m    }[m
[32m+[m[32m}[m
\ No newline at end of file[m
[1mdiff --git a/app/Http/Controllers/Api/StudentController.php b/app/Http/Controllers/Api/StudentController.php[m
[1mnew file mode 100644[m
[1mindex 0000000..a6f1b3e[m
[1m--- /dev/null[m
[1m+++ b/app/Http/Controllers/Api/StudentController.php[m
[36m@@ -0,0 +1,91 @@[m
[32m+[m[32m<?php[m
[32m+[m
[32m+[m[32mnamespace App\Http\Controllers\Api;[m
[32m+[m
[32m+[m[32muse App\Enums\Role;[m
[32m+[m[32muse App\Http\Controllers\Controller;[m
[32m+[m[32muse App\Models\Student;[m
[32m+[m[32muse Illuminate\Http\Request;[m
[32m+[m[32muse Illuminate\Support\Facades\DB;[m
[32m+[m[32muse Illuminate\Support\Facades\Hash;[m
[32m+[m[32muse Illuminate\Support\Str;[m
[32m+[m
[32m+[m
[32m+[m[32mclass StudentController extends Controller[m
[32m+[m[32m{[m
[32m+[m[32m    public function index(Request $request)[m
[32m+[m[32m    {[m
[32m+[m[32m        $students = $this->visibleStudents($request)[m
[32m+[m[32m            ->with('profile')[m
[32m+[m[32m            ->orderBy('nickname')[m
[32m+[m[32m            ->get()[m
[32m+[m[32m            ->map(fn (Student $s) => [[m
[32m+[m[32m                'id' => $s->id,[m
[32m+[m[32m                'nickname' => $s->nickname,[m
[32m+[m[32m                'login_code' => $s->login_code,[m
[32m+[m[32m                'section_id' => $s->section_id,[m
[32m+[m[32m                'full_name' => $s->full_name,[m
[32m+[m[32m                'profile' => $s->profile,[m
[32m+[m[32m            ]);[m
[32m+[m
[32m+[m[32m        return response()->json($students);[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    public function store(Request $request)[m
[32m+[m[32m    {[m
[32m+[m[32m        $user = $request->user();[m
[32m+[m
[32m+[m[32m        if (! $user->section_id) {[m
[32m+[m[32m            return response()->json(['message' => 'Your account has no section assigned.'], 422);[m
[32m+[m[32m        }[m
[32m+[m
[32m+[m[32m        $data = $request->validate([[m
[32m+[m[32m            'nickname' => ['required', 'string', 'max:50'],[m
[32m+[m[32m            'full_name' => ['required', 'string', 'max:255'],[m
[32m+[m[32m            'developmental_notes' => ['nullable', 'string'],[m
[32m+[m[32m        ]);[m
[32m+[m
[32m+[m[32m        $pin = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);[m
[32m+[m
[32m+[m[32m        $student = DB::transaction(function () use ($user, $data, $pin) {[m
[32m+[m[32m            $student = Student::create([[m
[32m+[m[32m                'teacher_id' => $user->id,[m
[32m+[m[32m                'section_id' => $user->section_id,[m
[32m+[m[32m                'nickname' => $data['nickname'],[m
[32m+[m[32m                'full_name' => $data['full_name'],[m
[32m+[m[32m                'developmental_notes' => $data['developmental_notes'] ?? null,[m
[32m+[m[32m                'login_code' => $this->uniqueLoginCode(),[m
[32m+[m[32m                'login_pin_hash' => Hash::make($pin),[m
[32m+[m[32m            ]);[m
[32m+[m
[32m+[m[32m            $student->profile()->create([]);[m
[32m+[m
[32m+[m[32m            return $student;[m
[32m+[m[32m        });[m
[32m+[m
[32m+[m[32m        return response()->json([[m
[32m+[m[32m            'student' => $student->load('profile'),[m
[32m+[m[32m            'login_code' => $student->login_code,[m
[32m+[m[32m            'pin' => $pin, // shown only this once[m
[32m+[m[32m        ], 201);[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    // Teachers see only their own section. Other staff roles see all students.[m
[32m+[m[32m    private function visibleStudents(Request $request)[m
[32m+[m[32m    {[m
[32m+[m[32m        $user = $request->user();[m
[32m+[m
[32m+[m[32m        return $user->role === Role::Teacher[m
[32m+[m[32m            ? Student::where('section_id', $user->section_id)[m
[32m+[m[32m            : Student::query();[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    private function uniqueLoginCode(): string[m
[32m+[m[32m    {[m
[32m+[m[32m        do {[m
[32m+[m[32m            $code = strtoupper(Str::random(6));[m
[32m+[m[32m        } while (Student::withTrashed()->where('login_code', $code)->exists());[m
[32m+[m
[32m+[m[32m        return $code;[m
[32m+[m[32m    }[m
[32m+[m[32m}[m[41m  [m
\ No newline at end of file[m
[1mdiff --git a/app/Http/Controllers/Controller.php b/app/Http/Controllers/Controller.php[m
[1mnew file mode 100644[m
[1mindex 0000000..8677cd5[m
[1m--- /dev/null[m
[1m+++ b/app/Http/Controllers/Controller.php[m
[36m@@ -0,0 +1,8 @@[m
[32m+[m[32m<?php[m
[32m+[m
[32m+[m[32mnamespace App\Http\Controllers;[m
[32m+[m
[32m+[m[32mabstract class Controller[m
[32m+[m[32m{[m
[32m+[m[32m    //[m
[32m+[m[32m}[m
[1mdiff --git a/app/Http/Middleware/EnsureRole.php b/app/Http/Middleware/EnsureRole.php[m
[1mnew file mode 100644[m
[1mindex 0000000..1f85574[m
[1m--- /dev/null[m
[1m+++ b/app/Http/Middleware/EnsureRole.php[m
[36m@@ -0,0 +1,21 @@[m
[32m+[m[32m<?php[m
[32m+[m
[32m+[m[32mnamespace App\Http\Middleware;[m
[32m+[m
[32m+[m[32muse Closure;[m
[32m+[m[32muse Illuminate\Http\Request;[m
[32m+[m[32muse Symfony\Component\HttpFoundation\Response;[m
[32m+[m
[32m+[m[32mclass EnsureRole[m
[32m+[m[32m{[m
[32m+[m[32m    public function handle(Request $request, Closure $next, string ...$roles): Response[m
[32m+[m[32m    {[m
[32m+[m[32m        $user = $request->user();[m
[32m+[m
[32m+[m[32m        if (! $user || ! in_array($user->role, $roles, true)) {[m
[32m+[m[32m            return response()->json(['message' => 'You do not have access to this.'], 403);[m
[32m+[m[32m        }[m
[32m+[m
[32m+[m[32m        return $next($request);[m
[32m+[m[32m    }[m
[32m+[m[32m}[m
\ No newline at end of file[m
[1mdiff --git a/app/Http/Middleware/HandleInertiaRequests.php b/app/Http/Middleware/HandleInertiaRequests.php[m
[1mnew file mode 100644[m
[1mindex 0000000..bdca0a8[m
[1m--- /dev/null[m
[1m+++ b/app/Http/Middleware/HandleInertiaRequests.php[m
[36m@@ -0,0 +1,46 @@[m
[32m+[m[32m<?php[m
[32m+[m
[32m+[m[32mnamespace App\Http\Middleware;[m
[32m+[m
[32m+[m[32muse Illuminate\Http\Request;[m
[32m+[m[32muse Inertia\Middleware;[m
[32m+[m
[32m+[m[32mclass HandleInertiaRequests extends Middleware[m
[32m+[m[32m{[m
[32m+[m[32m    /**[m
[32m+[m[32m     * The root template that's loaded on the first page visit.[m
[32m+[m[32m     *[m
[32m+[m[32m     * @see https://inertiajs.com/server-side-setup#root-template[m
[32m+[m[32m     *[m
[32m+[m[32m     * @var string[m
[32m+[m[32m     */[m
[32m+[m[32m    protected $rootView = 'app';[m
[32m+[m
[32m+[m[32m    /**[m
[32m+[m[32m     * Determines the current asset version.[m
[32m+[m[32m     *[m
[32m+[m[32m     * @see https://inertiajs.com/asset-versioning[m
[32m+[m[32m     */[m
[32m+[m[32m    public function version(Request $request): ?string[m
[32m+[m[32m    {[m
[32m+[m[32m        return parent::version($request);[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    /**[m
[32m+[m[32m     * Define the props that are shared by default.[m
[32m+[m[32m     *[m
[32m+[m[32m     * @see https://inertiajs.com/shared-data[m
[32m+[m[32m    