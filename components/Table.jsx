import React, { useState } from 'react';
import Groupby from 'lodash.groupby';
import Board, { moveCard } from '@lourenci/react-kanban';
import '@lourenci/react-kanban/dist/styles.css';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const board = {
  columns: [
    {
      id: 1,
      title: 'Age 1-18',
      backgroundColor: '#fff',
      cards: [
        {
          id: 1,
          title: 'Card title 1',
          description: 'Card content',
        },
        {
          id: 2,
          title: 'Card title 2',
          description: 'Card content',
        },
        {
          id: 3,
          title: 'Card title 3',
          description: 'Card content',
        },
      ],
    },
    {
      id: 2,
      title: 'Age 19-25',
      cards: [
        {
          id: 9,
          title: 'Card title 9',
          description: 'Card content',
        },
      ],
    },
    {
      id: 3,
      title: 'Q&A',
      cards: [
        {
          id: 10,
          title: 'Age 25-45',
          description: 'Card content',
        },
        {
          id: 11,
          title: 'Card title 11',
          description: 'Card content',
        },
      ],
    },
    {
      id: 4,
      title: 'Age 45+',
      cards: [
        {
          id: 12,
          title: 'Card title 12',
          description: 'Card content',
        },
        {
          id: 13,
          title: 'Card title 13',
          description: 'Card content',
        },
      ],
    },
  ],
};

const tasks = [
  { id: '1', content: 'First task' },
  { id: '2', content: 'Second task' },
  { id: '3', content: 'Third task' },
  { id: '4', content: 'Fourth task' },
  { id: '5', content: 'Fifth task' },
];

const taskStatus = {
  requested: {
    name: 'Requested',
    items: tasks,
  },
  toDo: {
    name: 'To do',
    items: [],
  },
  inProgress: {
    name: 'In Progress',
    items: [],
  },
  done: {
    name: 'Done',
    items: [],
  },
};

export const AgeColumns = ({ users }) => {
  const sampleUsers = users;

  console.log({ sampleUsers });

  const sample = [
    {
      name: 'sridhar',
      age: '18',
    },
    {
      name: 'sridhar',
      age: '24',
    },
    {
      name: 'sridhar',
      age: '44',
    },
    {
      name: 'sridhar',
      age: '46',
    },
    {
      name: 'sridhar',
      age: '47',
    },
  ];

  const columnsA = ['Age 1-18', 'Age 19-25', 'Age 25-45', 'Age 45+'];

  const modifiedUsers = sampleUsers.map((user) => {
    let title = '';

    if (user.age <= 18) {
      title = columnsA[0];
    } else if (user.age > 18 && user.age <= 25) {
      title = columnsA[1];
    } else if (user.age > 25 && user.age <= 45) {
      title = columnsA[2];
    } else {
      title = columnsA[3];
    }

    return {
      title,
      ...user,
    };
  });

  const usersx = Groupby(modifiedUsers, 'title') || [];

  const boardItems = Object.keys(usersx).map((item, index) => {
    const mapobj = usersx[item].map((user) => {
      return {
        title: user.name,
        description: user.age,
      };
    });

    return {
      id: index + 1,
      title: item,
      cards: [...mapobj],
    };
  });

  const bd = { columns: boardItems };
  const [controlledBoard, setBoard] = useState(bd);
  const [columns, setColumns] = useState(taskStatus);

  function handleCardMove(_card, source, destination) {
    const updatedBoard = moveCard(controlledBoard, source, destination);
    setBoard(updatedBoard);
  }

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  return (
    <div>
      <Board onCardDragEnd={handleCardMove}>{controlledBoard}</Board>

    
    </div>
  );
};
