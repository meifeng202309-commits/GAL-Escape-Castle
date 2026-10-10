import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildLibraryCodeModel as model } from '../implementation/library-code-model.mjs';

test('zero prefix: all five display slots; incomplete until all filled', () => {
  assert.deepEqual(model('', ''), {lockedPrefix:'', remainingSlotCount:5, slots:[null,null,null,null,null], isComplete:false, code:null});
  assert.deepEqual(model('', '01234').code, '01234');
});
test('partial prefix retains leading zero and maps suffix into five slots', () => {
  assert.deepEqual(model('07','19'), {lockedPrefix:'07',remainingSlotCount:3,slots:['0','7','1','9',null],isComplete:false,code:null});
  assert.equal(model('07','193').code,'07193');
});
test('all locked slots require no player-entered digits',()=>{
  assert.deepEqual(model('01234',''), {lockedPrefix:'01234',remainingSlotCount:0,slots:['0','1','2','3','4'],isComplete:true,code:'01234'});
});
test('array slots retain holes, no mutation',()=>{
  const entered=['8','','3']; const before=entered.slice();
  assert.deepEqual(model('01',entered).slots,['0','1','8',null,'3']);
  assert.deepEqual(entered,before);
  assert.equal(model('01',entered).code,null);
});
test('reject invalid authoritative prefix instead of repairing it',()=>{
  for(const p of [null,undefined,123,'a','1 2','123456','１２']) assert.throws(()=>model(p,''),TypeError);
});
test('reject invalid editable values, excess length and coercion',()=>{
  for(const s of [null,123,{},'1x','12 ','123456',['1','23'],[2],['1',null]]) assert.throws(()=>model('',s),TypeError);
  assert.throws(()=>model('1234','12'),TypeError);
  assert.throws(()=>model('12345',['']),TypeError);
});
test('does not mutate inputs and each call returns fresh slot array',()=>{
  const source=Object.freeze(['2','3']);
  const a=model('001',source); const b=model('001',source);
  assert.equal(a.code,'00123'); assert.notEqual(a.slots,b.slots);
  assert.deepEqual(source,['2','3']);
});
