'use client';
import { useCallback, useRef, useState } from 'react';
import type { LengthUnit, Measurement } from '@/calculators/types';
import { convert } from '@/lib/units';
import { formatNumber } from '@/lib/rounding';
import { track } from '@/lib/analytics';
export type WorkingUnit = 'inch' | 'cm';
export function useCalcFields<K extends string>(initial: Record<K,string>, lengthFields: readonly K[], initialUnit: WorkingUnit='inch') { const [values,setValues]=useState<Record<K,string>>(initial); const [unit,setUnitState]=useState<WorkingUnit>(initialUnit); const unitRef=useRef(unit); unitRef.current=unit; const setValue=useCallback((key:K,value:string)=>{setValues(prev=>({...prev,[key]:value}));},[]); const setUnit=useCallback((next:WorkingUnit)=>{const prev=unitRef.current;if(prev===next)return;setValues(vals=>{const out={...vals};for(const key of lengthFields){const raw=Number(vals[key]);if(vals[key]!==''&&Number.isFinite(raw)){out[key]=formatNumber(convert(raw,prev,next),3);}}return out;});setUnitState(next);track({name:'unit_system_changed',params:{from:prev,to:next}});},[lengthFields]); const measure=useCallback((key:K):Measurement=>({value:Number(values[key]),unit:unit as LengthUnit}),[values,unit]); return {values,unit,setValue,setUnit,measure,setValues}; }
