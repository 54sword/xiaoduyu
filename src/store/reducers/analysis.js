
import merge from 'lodash/merge'

export default function() {

  let initialState = {};

  return function analysis(state = initialState, action = {}) {
    switch (action.type) {

      case 'SET_ANALYSIS_LIST_BY_NAME':
        var { name, data } = action
        state[name] = data
        return merge({}, state, {})

      case 'SET_ANALYSIS':
        return merge({}, action.state, {})

      // 清空
      case 'CLEAN':
        return {}

      default:
        return state;
    }
  }

}

export const getAllAnalysis = (state) => {
  return state.analysis
}

export const getAllAnalysisListByName = (state, name) => {
  return state.analysis[name] ? state.analysis[name] : {}
}
