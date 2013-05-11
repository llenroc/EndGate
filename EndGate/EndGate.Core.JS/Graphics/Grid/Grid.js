var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EndGate;
(function (EndGate) {
    (function (Graphics) {
        var Grid = (function (_super) {
            __extends(Grid, _super);
            function Grid(x, y, rows, columns, tileWidth, tileHeight, drawGridLines, color) {
                if (typeof drawGridLines === "undefined") { drawGridLines = false; }
                if (typeof color === "undefined") { color = "gray"; }
                        _super.call(this, new EndGate.Vector2d(x, y));
                this._type = "Grid";
                var halfSize, topLeft, bottomRight;
                this._size = new EndGate.Size2d(tileWidth * columns, tileHeight * rows);
                this._tileSize = new EndGate.Size2d(tileWidth, tileHeight);
                this._grid = [];
                this._rows = rows;
                this._columns = columns;
                this._drawGridLines = drawGridLines;
                this._gridLines = [];
                halfSize = this._size.Multiply(.5);
                topLeft = new EndGate.Vector2d(-halfSize.Width, -halfSize.Height);
                bottomRight = new EndGate.Vector2d(halfSize.Width, halfSize.Height);
                for(var i = 0; i < rows; i++) {
                    this._grid[i] = [];
                    this._gridLines.push(new Graphics.Line2d(topLeft.X, topLeft.Y + i * this._tileSize.Height, bottomRight.X, topLeft.Y + i * this._tileSize.Height, 1));
                    for(var j = 0; j < columns; j++) {
                        if(i === 0) {
                            this._gridLines.push(new Graphics.Line2d(topLeft.X + j * this._tileSize.Width, topLeft.Y, topLeft.X + j * this._tileSize.Width, bottomRight.Y, 1));
                        }
                        this._grid[i].push(null);
                    }
                }
                this._gridLines.push(new Graphics.Line2d(topLeft.X, bottomRight.Y, bottomRight.X, bottomRight.Y, 1));
                this._gridLines.push(new Graphics.Line2d(bottomRight.X, topLeft.Y, bottomRight.X, bottomRight.Y, 1));
                this.Color(color);
            }
            Grid.prototype.Color = function (color) {
                if(typeof color !== "undefined") {
                    this._gridLineColor = color;
                    for(var i = 0; i < this._gridLines.length; i++) {
                        this._gridLines[i].Color(color);
                    }
                }
                return this._gridLineColor;
            };
            Grid.prototype.Size = function () {
                return this._size.Clone();
            };
            Grid.prototype.TileSize = function () {
                return this._tileSize.Clone();
            };
            Grid.prototype.Rows = function () {
                return this._rows;
            };
            Grid.prototype.Columns = function () {
                return this._columns;
            };
            Grid.prototype.Opacity = function (alpha) {
                return this.State.GlobalAlpha(alpha);
            };
            Grid.prototype.Fill = function (row, column, graphic) {
                row--;
                column--;
                graphic.Position = this.GetInsideGridPosition(row, column);
                this._grid[row][column] = graphic;
                this.AddChild(graphic);
            };
            Grid.prototype.FillSpace = function (row, column, graphicList) {
                var graphic;
                row--;
                column--;
                for(var i = 0; i < graphicList.length; i++) {
                    for(var j = 0; j < graphicList[i].length; j++) {
                        graphic = graphicList[i][j];
                        graphic.Position = this.GetInsideGridPosition(i + row, j + column);
                        this._grid[i + row][j + column] = graphic;
                        this.AddChild(graphic);
                    }
                }
            };
            Grid.prototype.FillRow = function (row, graphicList, offset) {
                if (typeof offset === "undefined") { offset = 0; }
                var graphic;
                row--;
                for(var i = 0; i < graphicList.length; i++) {
                    graphic = graphicList[i];
                    graphic.Position = this.GetInsideGridPosition(row, i + offset);
                    this._grid[row][i + offset] = graphic;
                    this.AddChild(graphic);
                }
            };
            Grid.prototype.FillColumn = function (column, graphicList, offset) {
                if (typeof offset === "undefined") { offset = 0; }
                var graphic;
                column--;
                for(var i = 0; i < graphicList.length; i++) {
                    graphic = graphicList[i];
                    graphic.Position = this.GetInsideGridPosition(i + offset, column);
                    this._grid[i + offset][column] = graphic;
                    this.AddChild(graphic);
                }
            };
            Grid.prototype.Get = function (row, column) {
                if(row > this._rows || row <= 0 || column > this._columns || column <= 0) {
                    return null;
                }
                return this._grid[row - 1][column - 1];
            };
            Grid.prototype.GetColumn = function (column) {
                var columnList = [];
                column--;
                for(var i = 0; i < this._rows; i++) {
                    columnList.push(this._grid[i][column]);
                }
                return columnList;
            };
            Grid.prototype.GetRow = function (row) {
                var rowList = [];
                row--;
                for(var i = 0; i < this._columns; i++) {
                    rowList.push(this._grid[row][i]);
                }
                return rowList;
            };
            Grid.prototype.GetSpace = function (rowStart, columnStart, rowEnd, columnEnd) {
                var space = [], rowIncrementor = (rowEnd >= rowStart) ? 1 : -1, columnIncrementor = (columnEnd >= columnStart) ? 1 : -1;
                for(var i = rowStart; i !== rowEnd + rowIncrementor; i += rowIncrementor) {
                    if(i > this._rows) {
                        break;
                    }
                    for(var j = columnStart; j !== columnEnd + columnIncrementor; j += columnIncrementor) {
                        if(j > this._columns) {
                            break;
                        }
                        space.push(this._grid[i - 1][j - 1]);
                    }
                }
                return space;
            };
            Grid.prototype.Clear = function (row, column) {
                var val = this._grid[row - 1][column - 1];
                this._grid[row - 1][column - 1] = null;
                this.RemoveChild(val);
                return val;
            };
            Grid.prototype.ClearRow = function (row) {
                var vals = [];
                row--;
                for(var i = 0; i < this._columns; i++) {
                    vals.push(this._grid[row][i]);
                    this.RemoveChild(this._grid[row][i]);
                    this._grid[row][i] = null;
                }
                return vals;
            };
            Grid.prototype.ClearColumn = function (column) {
                var vals = [];
                column--;
                for(var i = 0; i < this._rows; i++) {
                    vals.push(this._grid[i][column]);
                    this.RemoveChild(this._grid[i][column]);
                    this._grid[i][column] = null;
                }
                return vals;
            };
            Grid.prototype.ClearSpace = function (rowStart, columnStart, rowEnd, columnEnd) {
                var space = [], rowIncrementor = (rowEnd >= rowStart) ? 1 : -1, columnIncrementor = (columnEnd >= columnStart) ? 1 : -1;
                for(var i = rowStart; i !== rowEnd + rowIncrementor; i += rowIncrementor) {
                    if(i > this._rows) {
                        break;
                    }
                    for(var j = columnStart; j !== columnEnd + columnIncrementor; j += columnIncrementor) {
                        if(j > this._columns) {
                            break;
                        }
                        space.push(this._grid[i - 1][j - 1]);
                        this.RemoveChild(this._grid[i - 1][j - 1]);
                        this._grid[i - 1][j - 1] = null;
                    }
                }
                return space;
            };
            Grid.prototype.Draw = function (context) {
                _super.prototype.StartDraw.call(this, context);
                context.save();
                _super.prototype.EndDraw.call(this, context);
                if(this._drawGridLines) {
                    for(var i = 0; i < this._gridLines.length; i++) {
                        this._gridLines[i].Draw(context);
                    }
                }
                context.restore();
            };
            Grid.prototype.GetDrawBounds = function () {
                var bounds = new EndGate.Bounds.BoundingRectangle(this.Position, this._size);
                bounds.Rotation = this.Rotation;
                return bounds;
            };
            Grid.prototype.ConvertToRow = function (y) {
                return Math.floor(1 + (y - (this.Position.Y - this._size.HalfHeight())) / this._tileSize.Height);
            };
            Grid.prototype.ConvertToColumn = function (x) {
                return Math.floor(1 + (x - (this.Position.X - this._size.HalfWidth())) / this._tileSize.Width);
            };
            Grid.prototype.GetInsideGridPosition = function (row, column) {
                return new EndGate.Vector2d(column * this._tileSize.Width - this._size.HalfWidth() + this._tileSize.HalfWidth(), row * this._tileSize.Height - this._size.HalfHeight() + this._tileSize.HalfHeight());
            };
            return Grid;
        })(Graphics.Abstractions.Graphic2d);
        Graphics.Grid = Grid;        
    })(EndGate.Graphics || (EndGate.Graphics = {}));
    var Graphics = EndGate.Graphics;
})(EndGate || (EndGate = {}));
//@ sourceMappingURL=Grid.js.map
