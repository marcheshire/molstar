/**
 * Copyright (c) 2017 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 */

import * as Base from './impl/ordered-set'
import Interval from './interval'
import SortedArray from './sorted-array';

/** test */
namespace OrderedSet {
    export const Empty: OrderedSet = Base.Empty as any;
    export const ofSingleton: <T extends number = number>(value: T) => OrderedSet<T> = Base.ofSingleton as any;
    export const ofRange: <T extends number = number>(min: T, max: T) => OrderedSet<T> = Base.ofRange as any;
    export const ofBounds: <T extends number = number>(min: T, max: T) => OrderedSet<T> = Base.ofBounds as any;
    /** It is the responsibility of the caller to ensure the array is sorted and contains unique values. */
    export const ofSortedArray: <T extends number = number>(xs: ArrayLike<T>) => OrderedSet<T> = Base.ofSortedArray as any;

    export const has: <T extends number = number>(set: OrderedSet<T>, x: T) => boolean = Base.has as any;
    export const indexOf: <T extends number = number>(set: OrderedSet<T>, x: T) => number = Base.indexOf as any;
    export const getAt: <T extends number = number>(set: OrderedSet<T>, i: number) => T = Base.getAt as any;

    export const min: <T extends number = number>(set: OrderedSet<T>) => T = Base.min as any;
    export const max: <T extends number = number>(set: OrderedSet<T>) => T = Base.max as any;
    export const size: <T extends number = number>(set: OrderedSet<T>) => number = Base.size as any;
    export const hashCode: <T extends number = number>(set: OrderedSet<T>) => number = Base.hashCode as any;

    export const areEqual: <T extends number = number>(a: OrderedSet<T>, b: OrderedSet<T>) => boolean = Base.areEqual as any;
    export const areIntersecting: <T extends number = number>(a: OrderedSet<T>, b: OrderedSet<T>) => boolean = Base.areIntersecting as any;
    export const isSubset: <T extends number = number>(a: OrderedSet<T>, b: OrderedSet<T>) => boolean = Base.isSubset as any;

    export const union: <T extends number = number>(a: OrderedSet<T>, b: OrderedSet<T>) => OrderedSet<T> = Base.union as any;
    export const intersect: <T extends number = number>(a: OrderedSet<T>, b: OrderedSet<T>) => OrderedSet<T> = Base.intersect as any;
    export const subtract: <T extends number = number>(a: OrderedSet<T>, b: OrderedSet<T>) => OrderedSet<T> = Base.subtract as any;

    export const findPredecessorIndex: <T extends number = number>(set: OrderedSet<T>, x: number) => number = Base.findPredecessorIndex as any;
    export const findPredecessorIndexInInterval: <T extends number = number>(set: OrderedSet<T>, x: T, range: Interval) => number = Base.findPredecessorIndexInInterval as any;
    export const findRange: <T extends number = number>(set: OrderedSet<T>, min: T, max: T) => Interval = Base.findRange as any;

    export function forEach<T extends number, Ctx>(set: OrderedSet<T>, f: (v: T, i: number, ctx: Ctx) => void, ctx?: Ctx): Ctx {
        return Base.forEach(set as any, f as any, ctx);
    }

    export function isInterval<T extends number = number>(set: OrderedSet<T>): set is Interval<T> {
        return Interval.is(set);
    }

    export function isSortedArray<T extends number = number>(set: OrderedSet<T>): set is SortedArray<T> {
        return !Interval.is(set);
    }
}

/** Represents bla */
type OrderedSet<T extends number = number> = SortedArray<T> | Interval<T>


export default OrderedSet