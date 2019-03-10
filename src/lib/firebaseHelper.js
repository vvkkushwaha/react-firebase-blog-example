
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
    apiKey: "",
    authDomain: ".firebaseapp.com",
    databaseURL: "https://.firebaseio.com",
    projectId: "",
    storageBucket: ".appspot.com"};

firebase.initializeApp(config);

// ref to root of database node
const root = firebase.database().ref();

//ref to default storage bucket
const storageRef = firebase.storage().ref();

// get instance of current user
export const currentUser = firebase.auth();

// login using email & password
export const loginByEmail = async (email, password) => {
    return await firebase.auth().signInWithEmailAndPassword(email, password);
}

// register new user
export const registerByEmail = async (email, password) => {
    return await firebase.auth().createUserWithEmailAndPassword(email, password);
}

// upload images to storage bucket under images folder
export const uploadImageCallBack = (file) => {
    console.log('file uploAD start', file);

    return new Promise(
        (resolve, reject) => {
            const metadata = {
                contentType: file.type,
            };
            console.log('content type', file.type);
            storageRef.child("images/" + file.name).put(file, metadata).then(async function (snapshot) {
                const url = await snapshot.ref.getDownloadURL();
                console.log('Uploaded a blob or file!', url);
                resolve({ data: { link: url } });
            }).catch((error) => {
                reject(error);
            });
        },
    );
}

// add's a new blog for current user
export const addBlog = async (pageData) => {
    var newPostKey = root.child('blogs').push().key;
    let updatedBlog = {};
    updatedBlog[`/blogs/${currentUser.currentUser.uid}/${newPostKey}`] = pageData;
    root.update(updatedBlog);

    // if ispublished flag is true add ref to lastRecord for easy retrival of latest blog
    if (pageData.isPublished)
        root.child("lastRecord").set(`/blogs/${currentUser.currentUser.uid}/${newPostKey}`);
}

// update blog
export const updateBlog = async (key, pageData) => {
    let updatedBlog = {};
    updatedBlog[`/blogs/${currentUser.currentUser.uid}/${key}`] = pageData;
    root.update(updatedBlog);
    if (pageData.isPublished)
        root.child("lastRecord").set(`/blogs/${currentUser.currentUser.uid}/${key}`);
}

// remove blog 
export const removeBlog = async (key) => {
    root.child(`/blogs/${currentUser.currentUser.uid}/${key}`).remove();
}

// get last updated/latest blog
export const getLatest = async () => {
    return new Promise((resolve, reject) => {
        try {
            root.child('lastRecord').once('value', (snapshot) => {
                const keyToBlog = snapshot.val();
                root.child(keyToBlog).once('value', (blog) => {
                    resolve(blog.val());
                });
            });
        }
        catch (ex) {
            reject(ex);
        }
    });
}

// get current user blog for editing
export const getUserBlog = async (key) => {
    return new Promise((resolve, reject) => {
        try {
            root.child(`/blogs/${currentUser.currentUser.uid}/`).orderByKey().equalTo(key).once("value", function (snapshot) {
                console.log(snapshot.val());
                resolve(snapshot.val());
            });
        }
        catch (ex) {
            reject(ex);
        }
    });
}

// get blog by key
export const getBlog = async (key) => {
    return new Promise((resolve, reject) => {
        try {
            root.child(`blogs/${key}`).once("value", function (snapshot) {
                console.log(snapshot.val());
                resolve(snapshot.val());
            });
        }
        catch (ex) {
            reject(ex);
        }
    });
}

// get list of all blogs of current user
export const getAllUserBlogs = async (uid) => {
    return new Promise((resolve, reject) => {
        try {
            if (uid) {
                root.child(`blogs/${uid}`).once('value', (snapshot) => {
                    var data = [];
                    snapshot.forEach(ss => {
                        data.push({
                            title: ss.val().title, key: ss.key,
                            lastUpdateDate: ss.val().lastUpdateDate
                        });
                    });
                    resolve(data);
                });
            }
            else resolve([]);
        }
        catch (ex) {
            reject(ex);
        }
    });
}


// get list of all logs
export const getAllBlogs = async () => {
    return new Promise((resolve, reject) => {
        try {
            root.child('blogs').once('value', (snapshot) => {
                var data = [];
                snapshot.forEach(ss => {
                    ss.forEach(blog => {
                        if (blog.val().isPublished) {
                            data.push({
                                title: blog.val().title, key: `${ss.key}/${blog.key}`,
                                lastUpdateDate: blog.val().lastUpdateDate, desc: blog.val().desc,
                                showCaseImage: blog.val().showCaseImage
                            });
                        }
                    });
                });
                resolve(data);
            });
        }
        catch (ex) {
            reject(ex);
        }
    });
}
