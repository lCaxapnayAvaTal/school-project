import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}
// export const getAllUsers = createAsyncThunk(
//     'users/getAllUsers',
//     async (_, { rejectWithValue, dispatch, getState }) => {
//         // try {
//         //     const response = await axios.get(`http://localhost:8000/api/v1/cart`, userId);
//         //     return response.data;
//         // } catch (error) {
//         //     throw new Error('An error occurred while fetching cart data.');
//         // }
//         try {
//             function getCookie(name) {
//                 const value = `; ${document.cookie}`;
//                 const parts = value.split(`; ${name}=`);
//                 if (parts.length === 2) return parts.pop().split(';').shift();
//             }
//             const cookie = getCookie('access_token')
//             // const headers = {
//             //     token: cookie,
//             // };
//             console.log(cookie);
//             const res = await fetch(`http://localhost:3000/api/user/getusers`, {
//                 method: "GET",
//                 headers: { "Content-Type": "application/json" },
//                 Cookies: cookie,
//                 mode: 'no-cors',
//             });
//             // const pp = res.data
//             console.log(res);
            
//             dispatch(setUsers(res.data))
            
//             // if(res.ok){
//             //     setUsers(data.users)
//             //     if(data.users.length < 9){
//             //         setShowMore(false)
//             //     }
//             // }
//         } catch (error) {
//             console.log(error);
//         }
//     }
// )
// export const signin = createAsyncThunk(
//     'users/signin',
//     async ({formData}, { rejectWithValue, dispatch, getState }) => {
//         try {
//             dispatch(signInStart());
//             const res = await fetch("http://localhost:3000/api/auth/signin", {
//                 method: "POST", 
//                 headers: {'Content-Type' : 'application/json'},
//                 body: JSON.stringify(formData) 
//             });
//             console.log(res);
//             const data = await res.json()
//             if (data.success === false) {
//                 dispatch(signInFailure(data.message))
//             }
//             if (res.ok) {
//                 dispatch(signInSuccess(data))
//                 navigate("/");
//             }
//         } catch (error) {
//             dispatch(signInFailure(error.message))
//         }
//     }
// )
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signoutSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        setUsers: (state, action) => {
            state.users = action.payload
        }
    },
    // extraReducers: builder => {
    //     builder.addCase(getAllUsers.pending, (state, action) => {
    //         state.loading = true
    //     })
    //     builder.addCase(getAllUsers.fulfilled, (state, action) => {
    //         state.users = action.payload
    //         state.loading = false
    //     })
    //     builder.addCase(getAllUsers.rejected, (state, action) => {
    //         state.error = action.error.message
    //         state.loading = false
    //     })

    //     builder.addCase(signin.pending, (state, action) => {
    //         state.loading = true
    //     })
    //     builder.addCase(signin.fulfilled, (state, action) => {
    //         state.users = action.payload
    //         state.loading = false
    //     })
    //     builder.addCase(signin.rejected, (state, action) => {
    //         state.error = action.error.message
    //         state.loading = false
    //     })
    // }
})

export const { 
    signInStart, 
    signInSuccess, 
    signInFailure, 
    updateStart, 
    updateSuccess, 
    updateFailure, 
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutSuccess,
    setUsers
} = userSlice.actions;
export default userSlice.reducer;