import React from 'react';
import { convertGoalsToGoalListProps, getCompleteGoals } from '../store/goals/selectors';
import { StoreState } from '../store/types';
import { getBeginningOfDay } from '../utilities';
import { connect } from 'react-redux';
import { GoalList, GoalListProps } from '../components';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { handleGoalSwipe } from '../store/goals/thunks';

const today = getBeginningOfDay(new Date());

interface TodaysCompletedGoalsProps {
  onEditActionPress?: (goalId: string) => void;
  onChangeScrollEnabled?: (scrollEnabled: boolean) => void;
}

const mapStateToProps = (state: StoreState): GoalListProps => ({
  goals: convertGoalsToGoalListProps(state, getCompleteGoals(state, today), today).goals,
  emptyText: 'Nothing completed yet,\nbetter get started.',
});

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>, ownProps: TodaysCompletedGoalsProps) => ({
  onGoalEditSwipe: (goalId: string) => dispatch(handleGoalSwipe(goalId)),
  onEditActionPress: ownProps.onEditActionPress,
  onChangeScrollEnabled: ownProps.onChangeScrollEnabled,
});

export const TodaysCompletedGoals = connect(mapStateToProps, mapDispatchToProps)(GoalList);
