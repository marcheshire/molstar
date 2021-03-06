/**
 * Copyright (c) 2019-2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { ValueCell } from '../../mol-util/value-cell';
import { Vec2 } from '../../mol-math/linear-algebra';
import { TextureImage, createTextureImage } from '../../mol-gl/renderable/util';

export type TransparencyData = {
    tTransparency: ValueCell<TextureImage<Uint8Array>>
    uTransparencyTexDim: ValueCell<Vec2>
    dTransparency: ValueCell<boolean>,
    transparencyAverage: ValueCell<number>,
}

export function applyTransparencyValue(array: Uint8Array, start: number, end: number, value: number) {
    for (let i = start; i < end; ++i) {
        array[i] = value * 255;
    }
    return true;
}

export function getTransparencyAverage(array: Uint8Array, count: number): number {
    let sum = 0;
    for (let i = 0; i < count; ++i) {
        sum += array[i];
    }
    return sum / (255 * count);
}

export function clearTransparency(array: Uint8Array, start: number, end: number) {
    array.fill(0, start, end);
}

export function createTransparency(count: number, transparencyData?: TransparencyData): TransparencyData {
    const transparency = createTextureImage(Math.max(1, count), 1, Uint8Array, transparencyData && transparencyData.tTransparency.ref.value.array);
    if (transparencyData) {
        ValueCell.update(transparencyData.tTransparency, transparency);
        ValueCell.update(transparencyData.uTransparencyTexDim, Vec2.create(transparency.width, transparency.height));
        ValueCell.updateIfChanged(transparencyData.dTransparency, count > 0);
        ValueCell.updateIfChanged(transparencyData.transparencyAverage, getTransparencyAverage(transparency.array, count));
        return transparencyData;
    } else {
        return {
            tTransparency: ValueCell.create(transparency),
            uTransparencyTexDim: ValueCell.create(Vec2.create(transparency.width, transparency.height)),
            dTransparency: ValueCell.create(count > 0),
            transparencyAverage: ValueCell.create(0),
        };
    }
}

const emptyTransparencyTexture = { array: new Uint8Array(1), width: 1, height: 1 };
export function createEmptyTransparency(transparencyData?: TransparencyData): TransparencyData {
    if (transparencyData) {
        ValueCell.update(transparencyData.tTransparency, emptyTransparencyTexture);
        ValueCell.update(transparencyData.uTransparencyTexDim, Vec2.create(1, 1));
        return transparencyData;
    } else {
        return {
            tTransparency: ValueCell.create(emptyTransparencyTexture),
            uTransparencyTexDim: ValueCell.create(Vec2.create(1, 1)),
            dTransparency: ValueCell.create(false),
            transparencyAverage: ValueCell.create(0),
        };
    }
}