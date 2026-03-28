module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/favicon.ico (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/favicon.0x3dzn~oxb6tn.ico" + (globalThis["NEXT_CLIENT_ASSET_SUFFIX"] || ''));}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/app/favicon.ico (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 256,
    height: 256
};
}),
"[project]/src/lib/mock-data.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mockCurrentUser",
    ()=>mockCurrentUser,
    "mockCurrentUserSkills",
    ()=>mockCurrentUserSkills,
    "mockMatches",
    ()=>mockMatches,
    "mockUsers",
    ()=>mockUsers
]);
const mockCurrentUser = {
    id: '1',
    github_id: 'dev1',
    name: 'Alex Chen',
    avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
    bio: 'Full-stack developer passionate about React and Node.js. Love building developer tools.',
    location: 'Seattle, WA',
    html_url: 'https://github.com/alexchen'
};
const mockCurrentUserSkills = [
    {
        id: '1',
        user_id: '1',
        skill_name: 'React',
        skill_count: 15
    },
    {
        id: '2',
        user_id: '1',
        skill_name: 'TypeScript',
        skill_count: 12
    },
    {
        id: '3',
        user_id: '1',
        skill_name: 'Node.js',
        skill_count: 10
    },
    {
        id: '4',
        user_id: '1',
        skill_name: 'Next.js',
        skill_count: 8
    }
];
const mockMatches = [
    {
        userId: '2',
        name: 'Sarah Miller',
        avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
        skills: [
            'Go',
            'TypeScript',
            'React',
            'PostgreSQL'
        ],
        matchScore: 78,
        sharedSkills: [
            'React',
            'TypeScript'
        ],
        location: 'Seattle, WA',
        bio: 'Backend engineer with a frontend twist. Building scalable systems at startups.',
        htmlUrl: 'https://github.com/sarahmiller'
    },
    {
        userId: '3',
        name: 'James Wilson',
        avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
        skills: [
            'Python',
            'Django',
            'PostgreSQL',
            'AWS'
        ],
        matchScore: 65,
        sharedSkills: [
            'PostgreSQL'
        ],
        location: 'Seattle, WA',
        bio: 'Python enthusiast and cloud architect. Helping teams scale their infrastructure.',
        htmlUrl: 'https://github.com/jameswilson'
    },
    {
        userId: '4',
        name: 'Emily Zhang',
        avatar: 'https://avatars.githubusercontent.com/u/4?v=4',
        skills: [
            'React',
            'TypeScript',
            'GraphQL',
            'Node.js'
        ],
        matchScore: 92,
        sharedSkills: [
            'React',
            'TypeScript',
            'Node.js'
        ],
        location: 'Remote',
        bio: 'Frontend specialist focused on developer experience and design systems.',
        htmlUrl: 'https://github.com/emilyzhang'
    },
    {
        userId: '5',
        name: 'Michael Park',
        avatar: 'https://avatars.githubusercontent.com/u/5?v=4',
        skills: [
            'Unity',
            'C#',
            'AR/VR',
            'Blender'
        ],
        matchScore: 45,
        sharedSkills: [],
        location: 'Seattle, WA',
        bio: 'Game developer exploring the metaverse. Always learning new 3D tech.',
        htmlUrl: 'https://github.com/michaelpark'
    },
    {
        userId: '6',
        name: 'Lisa Johnson',
        avatar: 'https://avatars.githubusercontent.com/u/6?v=4',
        skills: [
            'Vue.js',
            'TypeScript',
            'Node.js',
            'MongoDB'
        ],
        matchScore: 70,
        sharedSkills: [
            'TypeScript',
            'Node.js'
        ],
        location: 'Portland, OR',
        bio: 'Full-stack developer who loves Vue and building community tools.',
        htmlUrl: 'https://github.com/lisajohnson'
    },
    {
        userId: '7',
        name: 'David Kim',
        avatar: 'https://avatars.githubusercontent.com/u/7?v=4',
        skills: [
            'Rust',
            'Go',
            'TypeScript',
            'WebAssembly'
        ],
        matchScore: 55,
        sharedSkills: [
            'TypeScript'
        ],
        location: 'San Francisco, CA',
        bio: 'Systems programmer exploring the boundaries of web performance.',
        htmlUrl: 'https://github.com/davidkim'
    },
    {
        userId: '8',
        name: 'Rachel Green',
        avatar: 'https://avatars.githubusercontent.com/u/8?v=4',
        skills: [
            'React',
            'Next.js',
            'Tailwind',
            'Prisma'
        ],
        matchScore: 88,
        sharedSkills: [
            'React',
            'Next.js'
        ],
        location: 'Seattle, WA',
        bio: 'Frontend engineer building beautiful, accessible web applications.',
        htmlUrl: 'https://github.com/rachelgreen'
    },
    {
        userId: '9',
        name: 'Tom Anderson',
        avatar: 'https://avatars.githubusercontent.com/u/9?v=4',
        skills: [
            'Java',
            'Spring',
            'PostgreSQL',
            'Docker'
        ],
        matchScore: 50,
        sharedSkills: [
            'PostgreSQL'
        ],
        location: 'Remote',
        bio: 'Backend developer with 10+ years of experience in enterprise systems.',
        htmlUrl: 'https://github.com/tomanderson'
    }
];
const mockUsers = [
    mockCurrentUser,
    {
        id: '2',
        github_id: 'dev2',
        name: 'Sarah Miller',
        avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
        bio: 'Backend engineer with a frontend twist. Building scalable systems at startups.',
        location: 'Seattle, WA',
        html_url: 'https://github.com/sarahmiller'
    },
    {
        id: '3',
        github_id: 'dev3',
        name: 'James Wilson',
        avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4',
        bio: 'Python enthusiast and cloud architect. Helping teams scale their infrastructure.',
        location: 'Seattle, WA',
        html_url: 'https://github.com/jameswilson'
    },
    {
        id: '4',
        github_id: 'dev4',
        name: 'Emily Zhang',
        avatar_url: 'https://avatars.githubusercontent.com/u/4?v=4',
        bio: 'Frontend specialist focused on developer experience and design systems.',
        location: 'Remote',
        html_url: 'https://github.com/emilyzhang'
    },
    {
        id: '5',
        github_id: 'dev5',
        name: 'Michael Park',
        avatar_url: 'https://avatars.githubusercontent.com/u/5?v=4',
        bio: 'Game developer exploring the metaverse. Always learning new 3D tech.',
        location: 'Seattle, WA',
        html_url: 'https://github.com/michaelpark'
    },
    {
        id: '6',
        github_id: 'dev6',
        name: 'Lisa Johnson',
        avatar_url: 'https://avatars.githubusercontent.com/u/6?v=4',
        bio: 'Full-stack developer who loves Vue and building community tools.',
        location: 'Portland, OR',
        html_url: 'https://github.com/lisajohnson'
    },
    {
        id: '7',
        github_id: 'dev7',
        name: 'David Kim',
        avatar_url: 'https://avatars.githubusercontent.com/u/7?v=4',
        bio: 'Systems programmer exploring the boundaries of web performance.',
        location: 'San Francisco, CA',
        html_url: 'https://github.com/davidkim'
    },
    {
        id: '8',
        github_id: 'dev8',
        name: 'Rachel Green',
        avatar_url: 'https://avatars.githubusercontent.com/u/8?v=4',
        bio: 'Frontend engineer building beautiful, accessible web applications.',
        location: 'Seattle, WA',
        html_url: 'https://github.com/rachelgreen'
    },
    {
        id: '9',
        github_id: 'dev9',
        name: 'Tom Anderson',
        avatar_url: 'https://avatars.githubusercontent.com/u/9?v=4',
        bio: 'Backend developer with 10+ years of experience in enterprise systems.',
        location: 'Remote',
        html_url: 'https://github.com/tomanderson'
    }
];
}),
"[project]/src/app/profile/[id]/ProfileClient.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/profile/[id]/ProfileClient.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/profile/[id]/ProfileClient.tsx <module evaluation>", "default");
}),
"[project]/src/app/profile/[id]/ProfileClient.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/profile/[id]/ProfileClient.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/profile/[id]/ProfileClient.tsx", "default");
}),
"[project]/src/app/profile/[id]/ProfileClient.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$profile$2f5b$id$5d2f$ProfileClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/profile/[id]/ProfileClient.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$profile$2f5b$id$5d2f$ProfileClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/app/profile/[id]/ProfileClient.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$profile$2f5b$id$5d2f$ProfileClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/profile/[id]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProfilePage,
    "generateStaticParams",
    ()=>generateStaticParams
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mock-data.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$profile$2f5b$id$5d2f$ProfileClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/profile/[id]/ProfileClient.tsx [app-rsc] (ecmascript)");
;
;
;
function generateStaticParams() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mockUsers"].map((user)=>({
            id: user.id
        }));
}
function ProfilePage({ params }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$profile$2f5b$id$5d2f$ProfileClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        userId: params.id
    }, void 0, false, {
        fileName: "[project]/src/app/profile/[id]/page.tsx",
        lineNumber: 16,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/app/profile/[id]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/profile/[id]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__03327w6._.js.map