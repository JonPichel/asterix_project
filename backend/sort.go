package main

type ByNone []DataRecord048
func (a ByNone) Len() int { return len(a) }
func (a ByNone) Swap(i, j int) { a[i], a[j] = a[j], a[i] }
func (a ByNone) Less(i, j int) bool { return a[i].Id < a[j].Id }

type BySSM []DataRecord048
func (a BySSM) Len() int { return len(a) }
func (a BySSM) Swap(i, j int) { a[i], a[j] = a[j], a[i] }
func (a BySSM) Less(i, j int) bool { return a[i].SecondsSinceMidnight < a[j].SecondsSinceMidnight }

type BySSMDesc []DataRecord048
func (a BySSMDesc) Len() int { return len(a) }
func (a BySSMDesc) Swap(i, j int) { a[i], a[j] = a[j], a[i] }
func (a BySSMDesc) Less(i, j int) bool { return a[i].SecondsSinceMidnight > a[j].SecondsSinceMidnight }

type ByID []DataRecord048
func (a ByID) Len() int { return len(a) }
func (a ByID) Swap(i, j int) { a[i], a[j] = a[j], a[i] }
func (a ByID) Less(i, j int) bool { return a[i].AircraftID < a[j].AircraftID }

type ByIDDesc []DataRecord048
func (a ByIDDesc) Len() int { return len(a) }
func (a ByIDDesc) Swap(i, j int) { a[i], a[j] = a[j], a[i] }
func (a ByIDDesc) Less(i, j int) bool { return a[i].AircraftID > a[j].AircraftID }

type ByAddress []DataRecord048
func (a ByAddress) Len() int { return len(a) }
func (a ByAddress) Swap(i, j int) { a[i], a[j] = a[j], a[i] }
func (a ByAddress) Less(i, j int) bool { return a[i].AircraftAddress < a[j].AircraftAddress }

type ByAddressDesc []DataRecord048
func (a ByAddressDesc) Len() int { return len(a) }
func (a ByAddressDesc) Swap(i, j int) { a[i], a[j] = a[j], a[i] }
func (a ByAddressDesc) Less(i, j int) bool { return a[i].AircraftAddress > a[j].AircraftAddress }