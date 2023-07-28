
import { User } from './user.js';
import { Post } from './post.js';
import { SearchResult } from './searchResult.js'; 

User.hasMany(Post, { as: 'posts', foreignKey: 'userId' });
Post.belongsTo(User, { as: 'user', foreignKey: 'userId' });

User.hasMany(SearchResult, { as: 'searchResults', foreignKey: 'userId' }); 
SearchResult.belongsTo(User, { as: 'user', foreignKey: 'userId' }); 

export { User, Post, SearchResult }; 
