// pocketbase-setup.js
// Run this in PocketBase Admin Console dla szybkiej konfiguracji

async function setupCollections() {
    // 1. Utwórz kolekcję Users
    const users = await db.createCollection({
        name: 'users',
        type: 'auth',
        schema: [
            {
                name: 'email',
                type: 'email',
                required: true,
                unique: true,
            },
            {
                name: 'username',
                type: 'text',
                required: true,
                unique: true,
            },
            {
                name: 'name',
                type: 'text',
                required: true,
            },
            {
                name: 'bio',
                type: 'text',
                required: false,
            },
            {
                name: 'avatar_url',
                type: 'url',
                required: false,
            },
            {
                name: 'verified',
                type: 'bool',
                default: false,
            },
            {
                name: 'followers_count',
                type: 'number',
                default: 0,
            },
            {
                name: 'created',
                type: 'autodate',
            },
        ],
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: 'true',
        updateRule: '@request.auth.id = id',
        deleteRule: '@request.auth.id = id',
    });

    // 2. Utwórz kolekcję Posts
    const posts = await db.createCollection({
        name: 'posts',
        type: 'base',
        schema: [
            {
                name: 'content',
                type: 'text',
                required: true,
            },
            {
                name: 'author',
                type: 'relation',
                collection: 'users',
                required: true,
            },
            {
                name: 'likes_count',
                type: 'number',
                default: 0,
            },
            {
                name: 'replies_count',
                type: 'number',
                default: 0,
            },
            {
                name: 'retweets_count',
                type: 'number',
                default: 0,
            },
            {
                name: 'images',
                type: 'file',
                required: false,
                multiple: true,
            },
            {
                name: 'hashtags',
                type: 'text',
                required: false,
            },
            {
                name: 'created',
                type: 'autodate',
            },
            {
                name: 'updated',
                type: 'autodate',
            },
        ],
        listRule: 'true',
        viewRule: 'true',
        createRule: '@request.auth.id != ""',
        updateRule: '@request.auth.id = author.id',
        deleteRule: '@request.auth.id = author.id',
    });

    // 3. Utwórz kolekcję Likes
    const likes = await db.createCollection({
        name: 'likes',
        type: 'base',
        schema: [
            {
                name: 'user',
                type: 'relation',
                collection: 'users',
                required: true,
            },
            {
                name: 'post',
                type: 'relation',
                collection: 'posts',
                required: true,
            },
            {
                name: 'created',
                type: 'autodate',
            },
        ],
        listRule: 'true',
        viewRule: 'true',
        createRule: '@request.auth.id = user',
        deleteRule: '@request.auth.id = user',
    });

    // 4. Utwórz kolekcję Comments/Replies
    const comments = await db.createCollection({
        name: 'comments',
        type: 'base',
        schema: [
            {
                name: 'content',
                type: 'text',
                required: true,
            },
            {
                name: 'author',
                type: 'relation',
                collection: 'users',
                required: true,
            },
            {
                name: 'post',
                type: 'relation',
                collection: 'posts',
                required: true,
            },
            {
                name: 'reply_to',
                type: 'relation',
                collection: 'comments',
                required: false,
            },
            {
                name: 'created',
                type: 'autodate',
            },
        ],
        listRule: 'true',
        viewRule: 'true',
        createRule: '@request.auth.id != ""',
        deleteRule: '@request.auth.id = author',
    });

    // 5. Utwórz kolekcję Followers
    const followers = await db.createCollection({
        name: 'followers',
        type: 'base',
        schema: [
            {
                name: 'follower',
                type: 'relation',
                collection: 'users',
                required: true,
            },
            {
                name: 'following',
                type: 'relation',
                collection: 'users',
                required: true,
            },
            {
                name: 'created',
                type: 'autodate',
            },
        ],
        listRule: 'true',
        viewRule: 'true',
        createRule: '@request.auth.id = follower',
        deleteRule: '@request.auth.id = follower',
    });

    console.log('✅ Wszystkie kolekcje stworzone!');
}

// Run:
// setupCollections().catch(e => console.error(e));


// ===== ADVANCED QUERIES =====

// Get timeline (posty od followowanych użytkowników + własne)
async function getTimeline(userId, page = 1) {
    return await pb.collection('posts').getList(page, 20, {
        filter: `author.id = "${userId}" || author.id in (select following from followers where follower = "${userId}")`,
        sort: '-created',
        expand: 'author,author.followers(follower,following)',
    });
}

// Get trending hashtags
async function getTrendingHashtags(limit = 10) {
    // PocketBase nie ma built-in aggregation, więc fetch all i process
    const posts = await pb.collection('posts').getFullList({
        fields: 'hashtags',
    });

    const hashtagMap = {};
    posts.forEach(post => {
        if (post.hashtags) {
            const tags = post.hashtags.split(',').map(t => t.trim());
            tags.forEach(tag => {
                hashtagMap[tag] = (hashtagMap[tag] || 0) + 1;
            });
        }
    });

    return Object.entries(hashtagMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([tag, count]) => ({ tag, count }));
}

// Search posts
async function searchPosts(query) {
    return await pb.collection('posts').getList(1, 50, {
        filter: `content ~ "${query}" || hashtags ~ "${query}"`,
        sort: '-created',
        expand: 'author',
    });
}

// Get user profile with stats
async function getUserProfile(userId) {
    const user = await pb.collection('users').getOne(userId, {
        expand: 'followers(follower)',
    });

    const postsCount = await pb.collection('posts').getFullList({
        filter: `author = "${userId}"`,
    });

    const followersCount = user.expand?.['followers(follower)']?.length || 0;
    const followingCount = await pb.collection('followers').getFullList({
        filter: `follower = "${userId}"`,
    });

    return {
        ...user,
        stats: {
            posts: postsCount.length,
            followers: followersCount,
            following: followingCount.length,
        }
    };
}

// Like a post
async function likePost(userId, postId) {
    try {
        return await pb.collection('likes').create({
            user: userId,
            post: postId,
        });
    } catch (error) {
        if (error.response?.status === 400) {
            // Already liked, remove like
            return await removeLike(userId, postId);
        }
        throw error;
    }
}

// Remove like
async function removeLike(userId, postId) {
    const likes = await pb.collection('likes').getFullList({
        filter: `user = "${userId}" && post = "${postId}"`,
    });

    if (likes.length > 0) {
        return await pb.collection('likes').delete(likes[0].id);
    }
}

// Follow user
async function followUser(followerId, followingId) {
    return await pb.collection('followers').create({
        follower: followerId,
        following: followingId,
    });
}

// Unfollow user
async function unfollowUser(followerId, followingId) {
    const relations = await pb.collection('followers').getFullList({
        filter: `follower = "${followerId}" && following = "${followingId}"`,
    });

    if (relations.length > 0) {
        return await pb.collection('followers').delete(relations[0].id);
    }
}


// ===== REALTIME SUBSCRIPTIONS =====

// Subscribe to new posts
async function subscribeToPosts(callback) {
    return pb.collection('posts').subscribe('*', (e) => {
        callback(e.record);
    });
}

// Subscribe to likes on a post
async function subscribeToPostLikes(postId, callback) {
    return pb.collection('likes').subscribe('*', (e) => {
        if (e.record.post === postId) {
            callback(e.record);
        }
    });
}

// ===== UTILITIES =====

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'właśnie teraz';
    if (minutes < 60) return `${minutes}m temu`;
    if (hours < 24) return `${hours}h temu`;
    if (days < 7) return `${days}d temu`;
    
    return date.toLocaleDateString('pl-PL');
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Extract hashtags
function extractHashtags(text) {
    const regex = /#[\w]+/g;
    return text.match(regex) || [];
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
