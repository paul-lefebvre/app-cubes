// indexSwiper = 2 = première page active
const initialState = {indexSwiper: 1, indexTitle: 1};

function togglePage(state = initialState, action) {
  let nextState;
  switch (action.type) {
    case 'SWIPE_TITLE':
      // changement de la page
      nextState = {
        indexTitle: action.value,
      };

      return nextState;

    case 'TOGGLE_PAGE':
      // changement de la page
      nextState = {
        indexSwiper: action.value,
      };

      return nextState;
    default:
      return state;
  }
}

export default togglePage;
