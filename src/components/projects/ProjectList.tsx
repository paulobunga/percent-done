import React, { FunctionComponent } from 'react';
import { EmptyContainer } from '../misc/EmptyContainer';
import { SwipeableItemAction } from '../misc/SwipeableItem';
import { Icons } from '../../../assets';
import { colors } from '../../theme';
import { SwipeableList } from '../misc/SwipeableList';
import { ProjectRow, ProjectRowProps } from './ProjectRow';

export interface ProjectListProps {
  projects: ProjectRowProps[],
  /**
   * Text to show then this list is empty.
   */
  emptyText?: string;
  onEditActionInteraction?: (projectId?: string) => void;
}

export const ProjectList: FunctionComponent<ProjectListProps> = ({ projects, emptyText = '', onEditActionInteraction }) => {
  if (projects.length === 0) {
    return <EmptyContainer text={emptyText} />;
  }

  const editAction: SwipeableItemAction = {
    icon: Icons.edit,
    color: colors.yellow,
    onInteraction: onEditActionInteraction,
  };

  return (
    <SwipeableList
      data={projects}
      actionsRight={[editAction]}
      actionWidth={60}
      renderItem={({ item }: { item: ProjectRowProps }) => <ProjectRow {...item} />}
      keyExtractor={item => item.id}
    />
  );
};
