const initialState = {listBornes: []};

function retrieveBornesList(state = initialState, action) {
  let nextState;
  switch (action.type) {
    case 'RETRIEVE_LIST':
      nextState = {
        listBornes: [action.value],
      };
      return nextState || state;
    default:
      return state;
  }
}

export default retrieveBornesList;
