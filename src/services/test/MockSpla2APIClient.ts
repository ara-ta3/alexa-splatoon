import {
  JsonResponseBody,
  ShakeResponseBody,
  Spla2APIClient,
} from "../Spla2API";

export class MockSpla2APIClient implements Spla2APIClient {
  async getSchedule(): Promise<JsonResponseBody> {
    return {
      result: {
        regular: [],
        gachi: [
          {
            start: "2020-12-31T07:00:00",
            end: "2020-12-31T09:00:00",
            rule: "ガチヤグラ",
            maps: ["ショッツル鉱山", "バッテラストリート"],
            maps_ex: [
              {
                image: "",
              },
            ],
          },
          {
            start: "2020-12-31T09:00:00",
            end: "2020-12-31T11:00:00",
            rule: "ガチエリア",
            maps: ["フジツボスポーツクラブ", "ムツゴ楼"],
            maps_ex: [
              {
                image: "",
              },
            ],
          },
        ],
        league: [
          {
            start: "2020-12-31T07:00:00",
            end: "2020-12-31T09:00:00",
            rule: "ガチエリア",
            maps: ["ホッケふ頭", "ガンガゼ野外音楽堂"],
            maps_ex: [
              {
                image: "",
              },
            ],
          },
          {
            start: "2020-12-31T09:00:00",
            end: "2020-12-31T11:00:00",
            rule: "ガチヤグラ",
            maps: ["タチウオパーキング", "アジフライスタジアム"],
            maps_ex: [
              {
                image: "",
              },
            ],
          },
        ],
      },
    };
  }
  async getShake(): Promise<ShakeResponseBody> {
    return {
      result: [
        {
          start: "2020-12-30T21:00:00",
          end: "2021-01-01T09:00:00",
          stage: {
            image: "",
            name: "朽ちた箱舟 ポラリス",
          },
          weapons: [
            {
              name: "クアッドホッパーブラック",
            },
            {
              name: "ヴァリアブルローラー",
            },
            {
              name: "スパラマニューバー",
            },
            {
              name: "リッター4K",
            },
          ],
        },
      ],
    };
  }
}
