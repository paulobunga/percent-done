import { ThunkAction } from 'redux-thunk';
import { StoreState } from '../types';
import { GoalActionTypes } from '../goals/types';
import { editGoal, updateTrackedGoalProjectId } from '../goals/actions';
import { DELETE_PROJECT, Project, ProjectActionTypes } from './types';
import { addProject } from './actions';
import { getProjectByTitle } from './selectors';
import { TimetableEntryActionTypes } from '../timetableEntries/types';
import { getAllGoals } from '../goals/selectors';
import { getTimetableEntriesByProjectId } from '../timetableEntries/selectors';
import { editTimetableEntry } from '../timetableEntries/actions';

export const createProjectAndReturnId = (title: string): ThunkAction<void, StoreState, void, ProjectActionTypes | GoalActionTypes> => {
  return (dispatch, getState) => {
    dispatch(addProject(title));

    const state = getState();
    const project = getProjectByTitle(state, title);

    if (project == null) {
      throw Error('Project does not exist.');
    }

    return project.id;
  };
};

export const createProjectAndSetTrackedGoalProject = (title: string, goalId: string): ThunkAction<void, StoreState, void, ProjectActionTypes | GoalActionTypes> => {
  return (dispatch) => {
    const id = dispatch(createProjectAndReturnId(title)) as unknown as string;

    dispatch(updateTrackedGoalProjectId(id, goalId));
  };
};

export const deleteProject = (project: Project): ThunkAction<void, StoreState, void, ProjectActionTypes | GoalActionTypes | TimetableEntryActionTypes> => {
  return (dispatch, getState) => {
    const store = getState();

    const goalsWithThisProjectId = getAllGoals(store, { includeDeleted: true }).filter(goal => goal.lastProjectId === project.id);
    goalsWithThisProjectId.forEach(goal => {
      dispatch(editGoal({ ...goal, lastProjectId: undefined }));
    });

    const timetableEntriesWithThisProjectId = getTimetableEntriesByProjectId(store, project.id);
    timetableEntriesWithThisProjectId.forEach(entry => {
      dispatch(editTimetableEntry({ ...entry, projectId: undefined }, entry));
    });

    dispatch({
      type: DELETE_PROJECT,
      project,
    });
  };
};
