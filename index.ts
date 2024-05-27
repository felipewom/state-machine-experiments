import {
  createActor,
  setup,
} from 'xstate';

export const machine = setup({
  types: {
    context: {} as {},
    events: {} as { type: "next" } | { type: "back" },
  },
  actions: {
    reset: function ({ context, event }, params) {
      console.log("Resetting");
    },
  },
  guards: {
    "some condition": function ({ context, event }) {
      console.log("Checking some condition");
      return true;
    },
  },
}).createMachine({
  context: {},
  id: "Untitled",
  initial: "Initial state",
  states: {
    "Initial state": {
      on: {
        next: {
          target: "Another state",
        },
      },
    },
    "Another state": {
      on: {
        next: [
          {
            target: "Parent state",
            guard: {
              type: "some condition",
            },
          },
          {
            target: "Initial state",
          },
        ],
      },
    },
    "Parent state": {
      initial: "Child state",
      on: {
        back: {
          target: "Initial state",
          actions: ({ context, event }) => {
            console.log(context, event);
            return {
              type: "reset",
            };
          },
        },
      },
      states: {
        "Child state": {
          on: {
            next: {
              target: "Another child state",
            },
          },
        },
        "Another child state": {},
      },
    },
  },
});

const actor = createActor(machine);

actor.start();

actor.subscribe((state) => {
  console.log('State:', state.value);
});

actor.send({
  type: "next",
});
actor.send({
  type: "next",
});
actor.send({
  type: "next",
});

