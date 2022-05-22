export abstract class MyClass<T extends MyClass<T>> {
  abstract equal(v: object): boolean;
  abstract fromJson(jsonObject: unknown, ...extend: unknown[]): T | undefined;
}
