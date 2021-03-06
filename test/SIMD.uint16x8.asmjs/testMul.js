//-------------------------------------------------------------------------------------------------------
// Copyright (C) Microsoft Corporation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE.txt file in the project root for full license information.
//-------------------------------------------------------------------------------------------------------
this.WScript.LoadScriptFile("..\\UnitTestFramework\\SimdJsHelpers.js");
function asmModule(stdlib, imports) {
    "use asm";

    var ui8 = stdlib.SIMD.Uint16x8;
    var ui8check = ui8.check;
    var ui8mul = ui8.mul;

    var globImportui8 = ui8check(imports.g1);

    var ui8g1 = ui8(6500, 9000, 3003, 1233, 1, 21, 300, 4545);
    var ui8g2 = ui8(10, 10, 10, 10, 10, 10, 10, 10);

    var loopCOUNT = 3;

    function testMulLocal()
    {
        var a = ui8(5, 10, 15, 20, 25, 30, 35, 40);
        var b = ui8(2, 2, 2, 2, 2, 2, 2, 2);
        var result = ui8(0, 0, 0, 0, 0, 0, 0, 0);

        var loopIndex = 0;
        while ( (loopIndex|0) < (loopCOUNT|0)) {
            result = ui8mul(a, b);
            loopIndex = (loopIndex + 1) | 0;
        }

        return ui8check(result);
    }
    function testMulGlobal()
    {    
        var result = ui8(0, 0, 0, 0, 0, 0, 0, 0);
        var loopIndex = 0;

        while ((loopIndex | 0) < (loopCOUNT | 0)) {
            result = ui8mul(ui8g1, ui8g2);
            loopIndex = (loopIndex + 1) | 0;
        }

        return ui8check(result);
    }

    function testMulGlobalImport()
    {
        var a = ui8(2, 2, 2, 2, 2, 2, 2, 2);
        var result = ui8(0, 0, 0, 0, 0, 0, 0, 0);
        var loopIndex = 0;

        while ((loopIndex | 0) < (loopCOUNT | 0)) {
            result = ui8mul(globImportui8, a);
            loopIndex = (loopIndex + 1) | 0;
        }

        return ui8check(result);
    }
    
    return {testMulLocal:testMulLocal, testMulGlobal:testMulGlobal, testMulGlobalImport:testMulGlobalImport};
}

var m = asmModule(this, { g1: SIMD.Uint16x8(5, 10, 15, 20, 25, 30, 35, 40) });

equalSimd([10, 20, 30, 40, 50, 60, 70, 80], m.testMulLocal(), SIMD.Uint16x8, "Test Mul");
equalSimd([65000, 24464, 30030, 12330, 10, 210, 3000, 45450], m.testMulGlobal(), SIMD.Uint16x8, "Test Mul");
equalSimd([10, 20, 30, 40, 50, 60, 70, 80], m.testMulGlobalImport(), SIMD.Uint16x8, "Test Mul");
print("PASS");