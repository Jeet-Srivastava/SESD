import test from 'node:test';
import assert from 'node:assert/strict';
import { ComplaintStateMachine } from './complaint.state.js';
import { ComplaintStatus } from '../../shared/types/roles.js';

test('ComplaintStateMachine allows valid transitions', () => {
  const stateMachine = new ComplaintStateMachine();

  assert.doesNotThrow(() => {
    stateMachine.ensureTransition(ComplaintStatus.CREATED, ComplaintStatus.ASSIGNED);
    stateMachine.ensureTransition(ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS);
    stateMachine.ensureTransition(ComplaintStatus.IN_PROGRESS, ComplaintStatus.RESOLVED);
  });
});

test('ComplaintStateMachine rejects invalid transitions', () => {
  const stateMachine = new ComplaintStateMachine();

  assert.throws(
    () => stateMachine.ensureTransition(ComplaintStatus.CREATED, ComplaintStatus.CLOSED),
    /Invalid transition/,
  );
});
