import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    fetchTrayList,
    fetchPeriod,
    fetchTrayCourse,
    CourseTraySelect,
    CourseTrayDeselect
} from '../../requests/wilma-api';

import {
    fetchFriendSelections,
    fetchSelections
} from '../../requests/theme-api';

import { handleError } from '../errors/errorSlice';

export const getTrayList = createAsyncThunk(
    'tray/getTrayList',
    async (options, thunkAPI) => {
        return new Promise((resolve, reject) => {
            const tray = thunkAPI.getState().tray;
            const auth = options['auth'];

            if(!tray.tray.isLoading) return resolve({changed: false});
            
            fetchTrayList(auth)
            .then(list => {
                return resolve({changed: true, periods: list['own']})
            })
            .catch(err => {
                thunkAPI.dispatch(handleError(err));
                return reject();
            })
            
        });
    }
)

export const getPeriod = createAsyncThunk(
    'tray/getPeriod',
    async (options, thunkAPI) => {
        return new Promise((resolve, reject) => {
            const tray = thunkAPI.getState().tray;
            const auth = options['auth'];
            const hash = options['hash'];
            
            if(tray.periods && !tray.periods[hash].isLoading) return resolve({changed: false});
            

            fetchPeriod(auth, hash)
            .then(list => {
                return resolve({changed: true, hash: hash, bars: list})
            })
            .catch(err => {
                thunkAPI.dispatch(handleError(err));
                return reject();
            })
            
        });
    }
)

export const getTrayCourse = createAsyncThunk(
    'tray/getTrayCourse',
    async (options, thunkAPI) => {
        return new Promise((resolve, reject) => {
            const auth = options['auth'];
            const hash = options['hash'];
            
            fetchTrayCourse(auth, hash)
            .then(course => {
                return resolve({changed: true, hash: hash, course: course})
            })
            .catch(err => {
                thunkAPI.dispatch(handleError(err));
                return reject();
            })
            
        });
    }
)

export const selectCourse = createAsyncThunk(
    'tray/selectCourse',
    async (options, thunkAPI) => {
        return new Promise((resolve, reject) => {
            const auth = options['auth'];
            const hash = options['hash'];
            
            CourseTraySelect(auth, hash)
            .then(() => {
                return resolve({changed: true, hash: hash})
            })
            .catch(err => {
                thunkAPI.dispatch(handleError(err));
                return reject();
            })
            
        });
    }
)

export const deselectCourse = createAsyncThunk(
    'tray/deselectCourse',
    async (options, thunkAPI) => {
        return new Promise((resolve, reject) => {
            const auth = options['auth'];
            const hash = options['hash'];
            
            CourseTrayDeselect(auth, hash)
            .then(() => {
                return resolve({changed: true, hash: hash})
            })
            .catch(err => {
                thunkAPI.dispatch(handleError(err));
                return reject();
            })
            
        });
    }
)

export const updateSelections = createAsyncThunk(
    'tray/updateSelections',
    async (options, thunkAPI) => {
        return new Promise((resolve, reject) => {
            const auth = options['auth'];
            
            fetchSelections(auth)
            .then(res => {
                return resolve({changed: true, list: res['data']})
            })
            .catch(err => {
                thunkAPI.dispatch(handleError(err));
                return reject();
            })
            
        });
    }
)

export const getFriendSelections = createAsyncThunk(
    'tray/getFriendSelections',
    async (options, thunkAPI) => {
        return new Promise((resolve, reject) => {
            const auth = options['auth'];
            
            fetchFriendSelections(auth)
            .then(res => {
                return resolve({changed: true, map: res})
            })
            .catch(err => {
                thunkAPI.dispatch(handleError(err));
                return reject();
            })
            
        });
    }
)


export const traySlice = createSlice({
    name: 'tray',
    initialState: {
        tray: {
            list: {},
            isLoading: true,
        },
        periods: {},
        courses: {},
        selected: [],
        overview: {

        },
        friends: {},
        isSelecting: false
    },
    reducers: {},
    extraReducers: {
        [getTrayList.fulfilled]: (state, action) => {
            if(!action.payload.changed) {
                return;
            }

            const schools = action.payload['periods'];
            
            Object.keys(schools).forEach(school => {
                schools[school].forEach((period, i) => {
                    if(!state.tray.list[school]) state.tray.list[school] = [];
                    state.tray.list[school].push({name: period.name, hash: period.href});

                    state.periods[period.href] = {
                        school: school,
                        name: period.name,
                        isLoading: true,
                        index: i,
                        bars: []
                    }
                })
            });

            state.tray.isLoading = false;
        },
        [getTrayList.rejected]: (state, action) => {
            state.isLoading = false;
        },
        [getPeriod.fulfilled]: (state, action) => {
            const hash = action.payload['hash'];
            if(!action.payload.changed) {
                return;
            }

            const bars = action.payload['bars'];
            bars.forEach(bar => {
                state.periods[hash] = {...state.periods[hash], ...{
                    bars: [...state.periods[hash].bars, {
                        name: bar.title,
                        hash: hash,
                        courses: bar.courses.map(course => {
                            const isSelected = course.class.includes('on');

                            if(isSelected && !state.selected.includes(course.hash)) state.selected.push(course.hash); 

                            state.courses[course.hash] = {...course, isLoading: true, isSelected: isSelected, period: hash, bar: state.periods[hash].bars.length, lops: course.code.startsWith('w') ? 'LOPS2016' : 'LOPS2021'}; 
                            return course.hash;
                        })
                    }],
                    isLoading: false
                }}
            })
        },
        [getPeriod.rejected]: (state, action) => {
            state.isLoading = false;
        },
        [getTrayCourse.fulfilled]: (state, action) => {
            const hash = action.payload['hash'];
            if(!action.payload.changed) {
                return;
            }

            const course = action.payload['course'];

            state.courses[hash] = {...state.courses[hash], ...course, ...{isLoading: false}}
        },
        [getTrayCourse.rejected]: (state, action) => {
            state.isLoading = false;
        },
        [updateSelections.fulfilled]: (state, action) => {
            if(!action.payload.changed) {
                return;
            }
            const list = action.payload['list'];

            list.forEach(course => {state.overview[course.period] = state.overview[course.period] ?[...state.overview[course.period], course]: [course];})
        },
        [getFriendSelections.fulfilled]: (state, action) => {
            if(!action.payload.changed) {
                return;
            }
            const map = action.payload['map'];
            const m = state.friends;
            
            Object.keys(map).forEach(username => {
                map[username].forEach(c => {m[c.trim()] = m[c.trim()] ? (m[c.trim()].includes(username) ? m[c.trim()] : [...m[c.trim()], username]) : [username]})
            })
        },
        [selectCourse.fulfilled]: (state, action) => {
            const hash = action.payload['hash'];
            
            state.courses[hash].isSelected = true;
            state.courses[hash].class = state.courses[hash].class.replace('off', 'on');
            state.selected = [...state.selected, hash];
            state.isSelecting = false;
        },
        [selectCourse.pending]: (state, action) => {
            state.isSelecting = true;
        },
        [deselectCourse.fulfilled]: (state, action) => {
            const hash = action.payload['hash'];
            
            state.courses[hash].isSelected = false;
            state.courses[hash].class = state.courses[hash].class.replace('on', 'off');
            state.selected = state.selected.filter(h => h !== hash);
            state.isSelecting = false;
        },
        [deselectCourse.pending]: (state, action) => {
            state.isSelecting = true;
        },
    },
});

export const useTray = (state) => ({
    tray: state.tray.tray,
    periods: state.tray.periods,
    courses: state.tray.courses,
    selected: state.tray.selected,
    friends: state.tray.friends,
    isSelecting: state.tray.isSelecting
});

export default traySlice.reducer;
