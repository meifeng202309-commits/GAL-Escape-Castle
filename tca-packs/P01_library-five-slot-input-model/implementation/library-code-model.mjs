/** Pure client-side display model; server owns acceptance, attempts and cooldown. */
export function buildLibraryCodeModel(lockedPrefix, enteredSlots) {
  if (typeof lockedPrefix !== 'string' || !/^\d{0,5}$/.test(lockedPrefix)) {
    throw new TypeError('lockedPrefix must be a string of 0–5 ASCII digits');
  }
  if (typeof enteredSlots !== 'string' && !Array.isArray(enteredSlots)) {
    throw new TypeError('enteredSlots must be a string or an array of individual slot strings');
  }
  const suffix = typeof enteredSlots === 'string' ? [...enteredSlots] : enteredSlots.slice();
  const remainingSlotCount = 5 - lockedPrefix.length;
  if (suffix.length > remainingSlotCount || suffix.some(x => typeof x !== 'string' || !/^[0-9]?$/.test(x))) {
    throw new TypeError('enteredSlots exceeds available positions or contains invalid slot values');
  }
  // Five display positions; editable suffix positions are represented by digit or null.
  const slots = [ ...lockedPrefix.split(''), ...Array.from({length:remainingSlotCount},(_,i)=>suffix[i] || null) ];
  const isComplete = slots.every(x => x !== null);
  return { lockedPrefix, remainingSlotCount, slots, isComplete, code: isComplete ? slots.join('') : null };
}
