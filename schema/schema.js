const graphql = require('graphql');
var _ = require('lodash');

//dummy data
var userData = [
    {id: '1', name: 'Billy', age: 39, profession: 'Teacher'},
    {id: '2', name: 'Rotich', age: 23, profession: 'Doctor'},
    {id: '3', name: 'Vincent', age: 25, profession: 'Technician'},
    {id: '4', name: 'Rachael', age: 34, profession: 'Software Engineer'},
    {id: '5', name: 'Veronicah', age: 54, profession: 'Electrical Engineer'},
    {id: '6', name: 'Mathew', age: 10, profession: 'Project Manager'},
    {id: '7', name: 'Blessing', age: 11, profession: 'Pilot'},
];

var hobbiesData = [
    {id: '12', title: 'Coding', description: 'Writing a bunch of characters that dont make sense', userId: '1'},
    {id: '13', title: 'Acting', description: 'Being someone you are not or want to be, really intriguing', userId: '2'},
    {id: '14', title: 'Writing', description: 'Expressing my feelings in words', userId: '5'},
    {id: '15', title: 'Adventure', description: 'Its all about the nature and the ambience that comes with it.', userId: '3'},
    {id: '16', title: 'Travelling', description: 'As they say, kutembea kwingi ni kuona mengi. So why not.', userId: '4'},
    {id: '17', title: 'Swimming', description: 'I low key wanted to be a mermid', userId: '1'},
];

var postsData = [
    {id: '20', comment: 'I love writing, what about you?', userId: '1'},
    {id: '21', comment: 'Flutter is amaizing', userId: '2'},
    {id: '23', comment: 'First time using graphql and I am loving every moment of it', userId: '1'},
    {id: '24', comment: 'I am awesome', userId: '1'},
    {id: '25', comment: 'I am going places, Amen', userId: '2'},
];

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = graphql

//create types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user...',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return _.filter(postsData, {userId: parent.id})
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return _.filter(hobbiesData, {userId: parent.id})
            }
        }
    }) 
});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby Description',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return _.find(userData, {id: parent.userId})
            }
        }
    })
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post description',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return _.find(userData, {id: parent.userId})
            }
        }
    })
})

//RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},

            resolve(parent, args) {
                return _.find(userData, {id: args.id})

                //we resolve with data
                //get and return data from a database
            }
        },
        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args) {
                return _.find(hobbiesData, {id: args.id})
            }
        },
        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args) {
                return _.find(postsData, {id: args.id})
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                //id: {type: GraphQLID}
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
                profession: {type: GraphQLString}
            },
            resolve(parent, args) {
                let user = {
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                }
                return user;
            }
        },
        createPost: {
            type: PostType,
            args: {
                //id: {type: GraphQLID}
                comment: {type: GraphQLString},
                userId: {type: GraphQLID}
            },
            resolve(parent, args) {
                let post = {
                    comment: args.comment,
                    userId: args.userId
                }
                return post;
            }
        },
        createHobby: {
            type: HobbyType,
            args: {
                //id: {type: GraphQLID}
                title: {type: GraphQLString},
                description: {type: GraphQLString},
                userId: {type: GraphQLID}
            },
            resolve(parent, args){
                let hobby = {
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                }
                return hobby;
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})